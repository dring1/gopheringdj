package lib

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/boltdb/bolt"
	"github.com/mgutz/ansi"
)

// type DataBase struct {
// 	*bolt.DB
// 	dbName     []byte
// 	bucketName string
// 	cache      []*Submission
// }

var (
	dbName     = []byte("gopheringdj")
	DB         *bolt.DB
	bucketName = time.Now().String()
	DBInfo     *log.Logger
	Red        = ansi.ColorFunc("red+")
	cache      []Submission
)

func init() {
	// move to main function
	var err error
	DB, err = bolt.Open("bolt.db", 0644, nil)
	if err != nil {
		log.Fatal(err)
	}
	DBInfo = log.New(os.Stdout, Red("[DB]: "), log.Ldate|log.Ltime)
	// defer db.Close()
}

func SetupTimer() {
	DBInfo.Printf(Red("DB Interval Timer Initialized"))
	ticker := time.NewTicker(24 * time.Hour)
	quit := make(chan struct{})
	go func() {
		for {
			select {
			case <-ticker.C:
				bucketName = time.Now().String()
			case <-quit:
				ticker.Stop()
				return
			}
		}
	}()
}

func InsertNewSubmissions(subs []*Submission) (string, error) {
	err := DB.Update(func(tx *bolt.Tx) error {
		b, err := tx.CreateBucketIfNotExists([]byte(bucketName))
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
	return bucketName, nil
}

func GetCurrent() ([]Submission, error) {
	err := DB.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		// m := b.Get([]byte)
		// b.Stats().
		c := b.Cursor()

		for k, v := c.First(); k != nil; k, v = c.Next() {

			// fmt.Printf("key=%s, value=%s\n", k, v)
			s := Submission{}
			err := json.Unmarshal(v, &s)
			if err != nil {
				return err
			}
			fmt.Printf("\n%+v\n", cache)
			cache = append(cache, s)
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	return cache, nil
}

func ViewAll() {
	// paginate the responses
}
