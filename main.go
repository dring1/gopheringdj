package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/dghubble/ctxh"
	"github.com/dghubble/gologin"
	"github.com/dghubble/gologin/github"
	"github.com/dghubble/sessions"
	"github.com/dring1/orm/models"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"golang.org/x/net/context"
	"golang.org/x/oauth2"
	githubOAuth2 "golang.org/x/oauth2/github"
)

const (
	sessionName    = "example-github-app"
	sessionSecret  = "example cookie signing secret"
	sessionUserKey = "githubID"
)

// sessionStore encodes and decodes session data stored in signed cookies
var sessionStore = sessions.NewCookieStore([]byte(sessionSecret), nil)

// Config configures the main ServeMux.
type Config struct {
	GithubClientID     string
	GithubClientSecret string
}

func init() {
	db, err := gorm.Open("postgres", "user=postgres sslmode=disable ")
	if err != nil {
		log.Fatal(err)
	}
	db.AutoMigrate(&model.Song{})
}

// New returns a new ServeMux with app routes.
func New(config *Config) *http.ServeMux {
	mux := http.NewServeMux()
	mux.Handle("/", http.StripPrefix("/", http.FileServer(http.Dir("static/"))))
	mux.Handle("/profile", requireLogin(http.HandlerFunc(profileHandler)))
	mux.HandleFunc("/logout", logoutHandler)
	// 1. Register LoginHandler and CallbackHandler
	oauth2Config := &oauth2.Config{
		ClientID:     config.GithubClientID,
		ClientSecret: config.GithubClientSecret,
		RedirectURL:  "http://localhost:8080/github/callback",
		Endpoint:     githubOAuth2.Endpoint,
	}
	// state param cookies require HTTPS by default; disable for localhost development
	stateConfig := gologin.DebugOnlyCookieConfig
	mux.Handle("/github/login", ctxh.NewHandler(github.StateHandler(stateConfig, github.LoginHandler(oauth2Config, nil))))
	mux.Handle("/github/callback", ctxh.NewHandler(github.StateHandler(stateConfig, github.CallbackHandler(oauth2Config, issueSession(), nil))))
	return mux
}

// issueSession issues a cookie session after successful Github login
func issueSession() ctxh.ContextHandler {
	fn := func(ctx context.Context, w http.ResponseWriter, req *http.Request) {
		githubUser, err := github.UserFromContext(ctx)
		fmt.Println(*githubUser)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		// 2. Implement a success handler to issue some form of session
		session := sessionStore.New(sessionName)
		session.Values[sessionUserKey] = *githubUser.ID
		session.Save(w)
		fmt.Println(session.Values)
		http.Redirect(w, req, "/profile", http.StatusFound)
	}
	return ctxh.ContextHandlerFunc(fn)
}

// welcomeHandler shows a welcome message and login button.
func welcomeHandler(w http.ResponseWriter, req *http.Request) {
	if req.URL.Path != "/" {
		http.NotFound(w, req)
		return
	}
	if isAuthenticated(req) {
		http.Redirect(w, req, "/profile", http.StatusFound)
		return
	}
	page, _ := ioutil.ReadFile("static/home.html")
	fmt.Fprintf(w, string(page))
}

// profileHandler shows protected user content.
func profileHandler(w http.ResponseWriter, req *http.Request) {
	fmt.Fprint(w, `<p>You are logged in!</p><form action="/logout" method="post"><input type="submit" value="Logout"></form>`)
}

// logoutHandler destroys the session on POSTs and redirects to home.
func logoutHandler(w http.ResponseWriter, req *http.Request) {
	if req.Method == "POST" {
		sessionStore.Destroy(w, sessionName)
	}
	http.Redirect(w, req, "/", http.StatusFound)
}

// requireLogin redirects unauthenticated users to the login route.
func requireLogin(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, req *http.Request) {
		if !isAuthenticated(req) {
			http.Redirect(w, req, "/", http.StatusFound)
			return
		}
		next.ServeHTTP(w, req)
	}
	return http.HandlerFunc(fn)
}

// isAuthenticated returns true if the user has a signed session cookie.
func isAuthenticated(req *http.Request) bool {
	if _, err := sessionStore.Get(req, sessionName); err == nil {
		return true
	}
	return false
}

// main creates and starts a Server listening.
func main() {
	const address = "localhost:8080"
	// read credentials from environment variables if available
	config := &Config{
		GithubClientID:     os.Getenv("GITHUB_CLIENT_ID"),
		GithubClientSecret: os.Getenv("GITHUB_CLIENT_SECRET"),
	}
	// allow consumer credential flags to override config fields
	clientID := flag.String("client-id", "", "Github Client ID")
	clientSecret := flag.String("client-secret", "", "Github Client Secret")
	flag.Parse()
	if *clientID != "" {
		config.GithubClientID = *clientID
	}
	if *clientSecret != "" {
		config.GithubClientSecret = *clientSecret
	}
	if config.GithubClientID == "" {
		log.Fatal("Missing Github Client ID")
	}
	if config.GithubClientSecret == "" {
		log.Fatal("Missing Github Client Secret")
	}

	log.Printf("Starting Server listening on %s\n", address)
	err := http.ListenAndServe(address, New(config))
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
