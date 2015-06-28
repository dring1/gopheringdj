package main

import (
	"fmt"
	"net/http"
	"time"

	"os"

	"github.com/dring1/gopheringdj/lib"
	"github.com/zenazn/goji"
)

// phae 1
// ping reddit on 60 minute intervals
// parse json data - key store based on time - update every hour
// serve client
// client makes websocket connections

var (
	port   string
	reddit *lib.RecurringReddit
)

func init() {
	if port = os.Getenv("DJPORT"); port == "" {
		port = "8080"
	}

	reddit = &lib.RecurringReddit{SubReddit: "Music", Domain: "search", Query: "sort=new&restrict_sr=on&q=flair%3Amusic%2Bstreaming", Interval: 10 * time.Second}
}

func main() {
	// At this point the init from DB has been called and bolt instantiated
	// we remeber to defer the close
	lib.SetupTimer()
	defer lib.DB.Close()

	// begin polling the database?

	go reddit.ContinuousPoll()
	goji.Get("/static", Hello)
	goji.Serve()
}

func Hello(w http.ResponseWriter, req *http.Request) {
	fmt.Fprintf(w, "%s", req.Method)
}
