package lib

import "github.com/boltdb/bolt"

var (
	db_name = []byte("gopheringdj")
	db      *bolt.DB
)
