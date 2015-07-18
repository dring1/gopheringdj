package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"os"

	"github.com/dring1/gopheringdj/lib"
	"github.com/gorilla/websocket"
	"github.com/zenazn/goji"
)

// phae 1
// ping reddit on 60 minute intervals
// parse json data - key store based on time - update every hour
// serve client
// client makes websocket connections

var (
	port     string
	reddit   *lib.RecurringReddit
	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin:     func(r *http.Request) bool { return true },
	}
)

type Message struct {
	Type string      `json:"type"`
	Data interface{} `json:"data"`
}

func init() {
	if port = os.Getenv("DJPORT"); port == "" {
		port = "8080"
	}

	reddit = &lib.RecurringReddit{SubReddit: "Music", Domain: "search", Query: "sort=new&restrict_sr=on&q=flair%3Amusic%2Bstreaming", Interval: 60 * time.Second}
}

func main() {
	// At this point the init from DB has been called and bolt instantiated
	// we remeber to defer the close
	lib.SetupTimer()
	defer lib.DB.Close()

	// begin polling the database?
	go reddit.ContinuousPoll()
	goji.Get("/current", current)
	goji.Get("/websocket", wsHandler)
	goji.Serve()
}

func current(w http.ResponseWriter, req *http.Request) {
	subs, err := lib.GetCurrent()
	if err != nil {
		fmt.Printf("%v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	js, err := json.Marshal(subs)
	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func wsHandler(res http.ResponseWriter, req *http.Request) {
	conn, err := upgrader.Upgrade(res, req, nil)
	if err != nil {
		log.Println(err)
		return
	}
	log.Println("Upgraded")
	subs, err := lib.GetCurrent()
	err = conn.WriteJSON(Message{Type: "Welcome", Data: subs})
	if err != nil {
		log.Println(err)
		return
	}
}
