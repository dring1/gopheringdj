package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"os"

	"github.com/dring1/gopheringdj/lib"
	"github.com/gorilla/websocket"
	"github.com/zenazn/goji"
)

type Message struct {
	Type string      `json:"type"`
	Data interface{} `json:"data"`
}

type CurrentPlayList struct {
	mutex           sync.Mutex
	currentPlayList []*lib.Submission
	updateCurrent   chan *lib.Submission
}

const (
	CURRENT_PLAYLIST_LIMIT = 500
)

var (
	port         string
	clientOrigin string
	reddit       *lib.RecurringReddit
	db           *lib.Database
	playlist     = CurrentPlayList{
		updateCurrent: make(chan *lib.Submission),
	}
	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin:     func(r *http.Request) bool { return true }}
)

func init() {
	if port = os.Getenv("DJPORT"); port == "" {
		port = "8080"
	}
	if clientOrigin = os.Getenv("GOPHERINGDJ_URL"); clientOrigin == "" {
		clientOrigin = "http://localhost:8080"
	}
	db = lib.NewDB("gopheringdj")
	reddit = lib.NewReddit("Music", "search", "sort=new&restrict_sr=on&q=flair%3Amusic%2Bstreaming", 1*time.Minute, db)

}

func main() {
	// At this point the init from DB has been called and bolt instantiated
	// we remeber to defer the close
	clear := db.SetupTimer()
	defer db.DB.Close()

	go playlist.playlistListener(clear)
	go reddit.ContinuousPoll(playlist.updateCurrent)

	goji.Use(Headers)
	goji.Get("/current", getCurrent)
	goji.Get("/websocket", wsHandler)
	goji.Serve()
}

func getCurrent(w http.ResponseWriter, req *http.Request) {
	js, err := json.Marshal(playlist.currentPlayList)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func wsHandler(res http.ResponseWriter, req *http.Request) {
	conn, err := upgrader.Upgrade(res, req, nil)
	if err != nil {
		log.Println(err)
		return
	}
	log.Println("Upgraded connection")
	// subs, err := lib.GetCurrent()
	err = conn.WriteJSON(Message{Type: "Welcome"})
	if err != nil {
		log.Println(err)
		return
	}
}

// Middlware for CORS
func Headers(h http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", clientOrigin)
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		h.ServeHTTP(w, r)
	}
	return http.HandlerFunc(fn)
}

func (p *CurrentPlayList) playlistListener(ticker <-chan time.Time) {
	go func() {
		for {
			select {
			case newSubmission := <-p.updateCurrent:
				// Current playlist is
				if len(p.currentPlayList) >= CURRENT_PLAYLIST_LIMIT {
					p.currentPlayList = make([]*lib.Submission, 0)
				}

				p.currentPlayList = append(p.currentPlayList, newSubmission)
			case <-ticker:
				log.Printf("Received Bucket update. Current size: %d", len(p.currentPlayList))
				p.currentPlayList = make([]*lib.Submission, 0)
				log.Printf("Resetting current playlist: %d", len(p.currentPlayList))
			}

		}
	}()
}
