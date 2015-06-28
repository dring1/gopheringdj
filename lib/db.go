package lib

import (
	"encoding/json"
	"log"
	"os"
	"time"

	"github.com/boltdb/bolt"
	"github.com/mgutz/ansi"
)

var (
	db_name    = []byte("gopheringdj")
	DB         *bolt.DB
	bucketName = time.Now().String()
	DBInfo     *log.Logger
	Red        = ansi.ColorFunc("red+")
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

func GetTodaysHits() {

}

func ViewAll() {
	// paginate the responses
}
