package lib

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/boltdb/bolt"
)

var (
	db_name = []byte("gopheringdj")
	DB      *bolt.DB
)

func init() {
	// move to main function
	var err error
	DB, err = bolt.Open("bolt.db", 0644, nil)
	if err != nil {
		log.Fatal(err)
	}
	// defer db.Close()
}

func InsertNewEntry(subs []*Submission) (string, error) {
	bucketName := []byte(time.Now().String())
	err := DB.Update(func(tx *bolt.Tx) error {
		b, err := tx.CreateBucketIfNotExists(bucketName)
		if err != nil {
			return err
		}
		fmt.Printf("%v", b)

		// b := tx.Bucket(bucketName)
		for _, sub := range subs {
			fmt.Printf("%v\n", sub)
			s, err := json.Marshal(sub)
			if err != nil {
				return err
			}
			err = b.Put([]byte("hi"), s)
			if err != nil {
				return err
			}
		}
		return nil
	})

	if err != nil {
		log.Fatal(err)
	}
	return "bucketName", nil
}
