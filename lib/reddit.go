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

var (
	AllowedDomains = [...]string{"youtube.com", "youtu.be", "soundcloud.com"}
	Info           *log.Logger
)

func init() {
	Info = log.New(os.Stdout, "INFO: ", log.Ldate|log.Ltime|log.Lshortfile)
}

const (
	BASE = "https://www.reddit.com"
)

type Response struct {
	Data struct {
		Children []struct {
			Sub *Submission `json:"data"`
		} `json:"children"`
	} `json:"data"`
}

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

func GetSubReddit(subReddit string, popularity string, opt Options) ([]*Submission, error) {
	// handle timeout
	url := BuildURL(subReddit, popularity, opt)
	res, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	r := new(Response)
	err = json.NewDecoder(res.Body).Decode(r)

	if err != nil {
		return nil, err
	}

	submissions := make([]*Submission, len(r.Data.Children))
	for i, child := range r.Data.Children {
		submissions[i] = child.Sub
	}
	return submissions, nil
}

func BuildURL(subReddit string, popularity string, opt Options) string {
	var url string
	if opt == nil {
		opt = Options{
			"limit": "100",
		}
	}
	url = fmt.Sprintf("%s/r/%s/%s.json", BASE, subReddit, popularity)
	var params string
	for k, v := range opt {
		params = strings.Join([]string{fmt.Sprintf("%s=%s", k, v), params}, "&")
	}
	params = strings.TrimRight(params, "&")
	url = url + "?" + params
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

func fetch(subreddit string, popularity string) error {
	magenta := ansi.ColorFunc("magenta+")
	Info.Println(magenta("%v ▶ info ******* \n"), time.Now())
	submissions, err := GetSubReddit(subreddit, popularity, nil)
	if err != nil {
		return err
	}

	filteredSubs := FilterLinksByAllowedDomain(submissions)
	_, err = InsertNewSubmissions(filteredSubs)
	if err != nil {
		return err
	}
	return nil
}

func ContinuousPoll(subreddit string, popularity string, interval time.Duration) {
	magenta := ansi.ColorFunc("magenta+")
	Info.Printf(magenta("%v ▶ info ******* \n"), time.Now())
	ticker := time.NewTicker(interval)
	go func() {
		for {
			select {
			case <-ticker.C:
				fetch(subreddit, popularity)
			}
		}
	}()
}
