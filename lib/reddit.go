package lib

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/mgutz/ansi"
)

type Response struct {
	Data struct {
		Children []struct {
			Sub *Submission `json:"data"`
		} `json:"children"`
	} `json:"data"`
}

var (
	AllowedDomains = [...]string{"youtube.com", "youtu.be", "m.youtube.com"}
	info           *log.Logger
	Magenta        = ansi.ColorFunc("magenta+")
)

func init() {
	info = log.New(os.Stdout, Magenta("[Reddit]: "), log.Ldate|log.Ltime)
}

const (
	BASE = "https://www.reddit.com"
)

type Submission struct {
	Author       string  `json:"author"`
	Title        string  `json:"title"`
	URL          string  `json:"url"`
	Domain       string  `json:"domain"`
	Subreddit    string  `json:"subreddit"`
	SubredditID  string  `json:"subreddit_id"`
	FullID       string  `json:"name"`
	ID           string  `json:"id"`
	Permalink    string  `json:"permalink"`
	ThumbnailURL string  `json:"thumbnail"`
	DateCreated  float32 `json:"created_utc"`
	NumComments  int     `json:"num_comments"`
	Score        int     `json:"score"`
	Ups          int     `json:"ups"`
	Downs        int     `json:"downs"`
	IsSelf       bool    `json:"is_self"`
	IsSaved      bool    `json:"saved"`
}

type Options map[string]string
type ID string

type RecurringReddit struct {
	SubReddit string
	Domain    string
	Query     string
	Interval  time.Duration
	Before    string
	db        *Database
}

func NewReddit(subreddit string, domain string, query string, dur time.Duration, d *Database) *RecurringReddit {
	return &RecurringReddit{
		SubReddit: subreddit,
		Domain:    domain,
		Query:     query,
		Interval:  dur,
		Before:    "",
		db:        d,
	}
}

func (r *RecurringReddit) GetSubReddit(opt Options) ([]*Submission, error) {
	// handle timeout
	url := r.BuildURL(opt)
	// log.Println(url)
	res, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	response := new(Response)
	err = json.NewDecoder(res.Body).Decode(response)

	if err != nil {
		return nil, err
	}

	submissions := make([]*Submission, len(response.Data.Children))
	for i, child := range response.Data.Children {
		submissions[i] = child.Sub
	}
	// log.Printf("Before set:  %v\n", r)
	if len(submissions) > 0 {
		r.Before = submissions[0].ID
	}
	// log.Printf("Before set:  %v\n", r)
	// log.Println(len(submissions))
	return submissions, nil
}

func (r *RecurringReddit) BuildURL(opt Options) string {
	var url string
	if opt == nil {
		opt = Options{
			"limit": "100",
		}
	}
	url = fmt.Sprintf("%s/r/%s/%s.json", BASE, r.SubReddit, r.Domain)
	opt["before"] = "t3_" + r.Before
	// log.Printf("r.Before: %s", r.Before)
	if r.Query != "" {
		url = fmt.Sprintf("%s?%s", url, r.Query)
	}

	var options string
	for k, v := range opt {
		options = strings.Join([]string{fmt.Sprintf("%s=%s", k, v), options}, "&")
	}
	options = strings.TrimRight(options, "&")
	url = url + "&" + options

	return url
}

func FilterLinksByAllowedDomain(subs []*Submission) []*Submission {
	// Limit to 50 - grow if required
	filteredLinks := []*Submission{}
	for _, sub := range subs {
		if sub.ValidDomain() {
			filteredLinks = append(filteredLinks, sub)
		}
	}
	return filteredLinks
}

func (s *Submission) ValidDomain() bool {
	valid := false
	if s == nil {
		return valid
	}

	for _, domain := range AllowedDomains {
		if s.Domain == domain {
			valid = true
			break
		}
	}
	return valid
}

func (r *RecurringReddit) fetch(c chan *Submission) error {
	// info.Printf(Magenta("Fetching /r/%s/%s.json"), r.SubReddit, r.Domain)
	submissions, err := r.GetSubReddit(nil)
	if err != nil {
		return err
	}

	filteredSubs := FilterLinksByAllowedDomain(submissions)
	_, err = r.db.InsertNewSubmissions(filteredSubs)
	if err != nil {
		return err
	}
	if len(submissions) > 0 {
		log.Printf("Filtered submissions from %d to %d", len(submissions), len(filteredSubs))
	}

	for _, sub := range filteredSubs {

		c <- sub
	}
	return nil
}

func (r *RecurringReddit) ContinuousPoll(c chan *Submission) {
	ticker := time.NewTicker(r.Interval)
	go func() {
		for {
			select {
			case <-ticker.C:
				r.fetch(c)
			}
		}
	}()
}
