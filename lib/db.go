package lib

import (
	"encoding/json"
	"log"
	"os"
	"time"

	"github.com/boltdb/bolt"
	"github.com/mgutz/ansi"
)

type Database struct {
	dbName     []byte
	DB         *bolt.DB
	bucketName string
	DBInfo     *log.Logger
	notify     chan struct{}
}

var (
	Red = ansi.ColorFunc("red+")
)

func NewDB(name string) *Database {
	db, err := bolt.Open("bolt.db", 0644, nil)
	if err != nil {
		log.Panic(err)
		return nil
	}
	return &Database{
		dbName:     []byte(name),
		DB:         db,
		bucketName: time.Now().String(),
		DBInfo:     log.New(os.Stdout, Red("[DB]: "), log.Ldate|log.Ltime),
	}
}

func (db *Database) SetupTimer() <-chan time.Time {
	db.DBInfo.Printf(Red("DB Interval Timer Initialized"))
	ticker := time.NewTicker(24 * time.Hour)
	quit := make(chan struct{})
	go func() {
		for {
			select {
			case <-ticker.C:
				db.bucketName = time.Now().String()
				db.DBInfo.Printf(Red("Interval Ticked: New Bucket: %s"), db.bucketName)
				// db.notify <- struct{}{}
			case <-quit:
				log.Println("Stopping ticker")
				ticker.Stop()
				return
			}
		}
	}()
	return ticker.C
}

func (db *Database) InsertNewSubmissions(subs []*Submission) (string, error) {
	err := db.DB.Update(func(tx *bolt.Tx) error {
		b, err := tx.CreateBucketIfNotExists([]byte(db.bucketName))
		if err != nil {
			return err
		}
		for _, sub := range subs {
			s, err := json.Marshal(sub)
			if err != nil {
				return err
			}
			err = b.Put([]byte(sub.ID), s)
			if err != nil {
				return err
			}
		}
		return nil
	})

	if err != nil {
		log.Fatal(err)
	}
	return db.bucketName, nil
}

func (db Database) GetCurrent() ([]Submission, error) {
	// Needs caching
	// Completely new Bucket
	// Or current bucket, just more
	curr := []Submission{}
	err := db.DB.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(db.bucketName))
		// m := b.Get([]byte)
		// b.Stats().
		c := b.Cursor()

		for k, v := c.First(); k != nil; k, v = c.Next() {
			s := Submission{}
			err := json.Unmarshal(v, &s)
			if err != nil {
				return err
			}
			// cache = append(cache, s)
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	return curr, nil
}

func ViewAll() {
	// paginate the responses
}
