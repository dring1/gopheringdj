package main

import (
	"fmt"
	"net/http"

	"os"

	"github.com/codegangsta/negroni"
	_ "github.com/darkhelmet/twitterstream"
	"github.com/dring1/gopheringdj/lib"
	"github.com/gorilla/mux"
)

// phae 1
// ping reddit on 60 minute intervals
// parse json data - key store based on time - update every hour
// serve client
// client makes websocket connections

var PORT string

func init() {
	if PORT = os.Getenv("DJPORT"); PORT == "" {
		PORT = "8080"
	}
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/", Hello)

	n := negroni.Classic()
	n.UseHandler(r)
	fmt.Printf("Listening on port: %s: ", PORT)
	http.ListenAndServe(":"+PORT, n)

	// At this point the init from DB has been called and bolt instantiated
	// we remeber to defer the close
	defer lib.DB.Close()
}

func Hello(w http.ResponseWriter, req *http.Request) {
	fmt.Fprintf(w, "%s", req.Method)
}
