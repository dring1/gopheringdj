package lib

import (
	"testing"
	"time"

	. "github.com/smartystreets/goconvey/convey"
	"github.com/stretchr/testify/assert"
)

var reddit = RecurringReddit{"Music", "search", "sort=new&restrict_sr=on&q=flair%3Amusic%2Bstreaming", time.Minute}

func Test_BuildURLWithOptions(t *testing.T) {
	Convey("Given some params build the expected url", t, func() {
		options := map[string]string{
			"limit": "5",
			"page":  "3",
		}

		expect := []string{
			"https://www.reddit.com/r/Music/search.json?sort=new&restrict_sr=on&q=flair%3Amusic%2Bstreaming&page=3&limit=5",
			"https://www.reddit.com/r/Music/search.json?sort=new&restrict_sr=on&q=flair%3Amusic%2Bstreaming&limit=5&page=3",
		}
		url := reddit.BuildURL(options)
		if url != expect[0] && url != expect[1] {
			t.Errorf("Expected url to equal: \n%s\nor\n%s\nGot:\n%s", expect[0], expect[1], url)
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
		data, err := reddit.GetSubReddit(options)
		a.NoError(err)
		a.NotEmpty(data)
	})
}

func Test_GetSubRedditWithoutState(t *testing.T) {
	Convey("Given a url get some subreddit results", t, func() {
		a := assert.New(t)
		data, err := reddit.GetSubReddit(nil)
		a.NoError(err)
		a.NotEmpty(data)
	})
}

func Test_FilterResults(t *testing.T) {
	Convey("Given a query only return music links", t, func() {
		a := assert.New(t)
		data, err := reddit.GetSubReddit(nil)

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
