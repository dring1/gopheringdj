package lib

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

var AllowedDomains = [...]string{"youtube.com", "youtu.be", "soundcloud.com"}

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
	Selftext     string  `json:"selftext"`
	ThumbnailURL string  `json:"thumbnail"`
	DateCreated  float32 `json:"created_utc"`
	NumComments  int     `json:"num_comments"`
	Score        int     `json:"score"`
	Ups          int     `json:"ups"`
	Downs        int     `json:"downs"`
	IsNSFW       bool    `json:"over_18"`
	IsSelf       bool    `json:"is_self"`
	WasClicked   bool    `json:"clicked"`
	IsSaved      bool    `json:"saved"`
	BannedBy     *string `json:"banned_by"`
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
