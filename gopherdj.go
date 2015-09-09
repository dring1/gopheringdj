package main

import (
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"sync"
	"time"

	"os"

	"github.com/dring1/gopheringdj/lib"
	"github.com/zenazn/goji"
)

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
)

func init() {
	if port = os.Getenv("DJPORT"); port == "" {
		port = "8080"
	}
	if clientOrigin = os.Getenv("GOPHERINGDJ_URL"); clientOrigin == "" {
		clientOrigin = "http://localhost:8080"
	}
	db = lib.NewDB("gopheringdj")
	reddit = lib.NewReddit("Music", "search", "sort=new&restrict_sr=on&q=flair%3Amusic%2Bstreaming", 5*time.Second, db)
	go hub.run()
}

func main() {
	// At this point the init from DB has been called and bolt instantiated
	// we remeber to defer the close
	clear := db.SetupTimer()
	defer db.DB.Close()

	go playlist.playlistListener(clear)
	go reddit.ContinuousPoll(playlist.updateCurrent)
	go playlist.MockNewSongAdd(15 * time.Second)

	goji.Use(Headers)
	goji.Get("/current", getCurrent)
	goji.Get("/websocket", serveWs)
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
				hub.BroadcastMessage(&Message{Type: "new_song", Data: newSubmission})
				// log.Println("New Song")
			case <-ticker:
				log.Printf("Received Bucket Reset. Current size: %d", len(p.currentPlayList))
				p.currentPlayList = make([]*lib.Submission, 0)
				// log.Printf("Resetting current playlist: %d", len(p.currentPlayList))
			}

		}
	}()
}

func (p *CurrentPlayList) MockNewSongAdd(interval time.Duration) {
	for range time.Tick(interval) {
		hub.BroadcastMessage(&Message{Type: "new_song", Data: p.currentPlayList[rand.Intn(len(p.currentPlayList))]})
	}
}
