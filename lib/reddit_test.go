package lib

import (
	"testing"

	. "github.com/smartystreets/goconvey/convey"
	"github.com/stretchr/testify/assert"
)

func Test_BuildURLWithOptions(t *testing.T) {
	Convey("Given some params build the expected url", t, func() {
		options := map[string]string{
			"limit": "5",
			"page":  "3",
		}
		subReddit := "Music"
		expect := []string{
			"https://www.reddit.com/r/Music/hot.json?page=3&limit=5",
			"https://www.reddit.com/r/Music/hot.json?limit=5&page=3",
		}
		url := BuildURL(subReddit, "hot", options)
		if url != expect[0] && url != expect[1] {
			t.Error("Expected url to equal: https://www.reddit.com/r/Music/hot.json?page=3&limit=5\nhttps://www.reddit.com/r/Music/hot.json?limit=5&page=3")
		}
	})
}

func Test_GetSubRedditWithState(t *testing.T) {
	Convey("Given a url get some subreddit results", t, func() {
		a := assert.New(t)
		options := map[string]string{
			"limit": "5",
			"page":  "3",
		}
		subReddit := "Music"
		data, err := GetSubReddit(subReddit, "new", options)
		a.NoError(err)
		a.NotEmpty(data)
	})
}

func Test_GetSubRedditWithoutState(t *testing.T) {
	Convey("Given a url get some subreddit results", t, func() {
		a := assert.New(t)
		subReddit := "Music"
		data, err := GetSubReddit(subReddit, "hot", nil)
		a.NoError(err)
		a.NotEmpty(data)
	})
}

func Test_FilterResults(t *testing.T) {
	Convey("Given a query only return music links", t, func() {
		a := assert.New(t)
		subReddit := "Music"
		data, err := GetSubReddit(subReddit, "hot", nil)

		filteredLinks := FilterLinksByAllowedDomain(data)
		for _, sub := range filteredLinks {
			if !sub.ValidDomain() {
				t.Errorf("Did not match any supported domains: %v, received: %s", AllowedDomains, sub.Domain)
			}
		}
		a.NoError(err)
		a.NotEmpty(data)
	})
}
