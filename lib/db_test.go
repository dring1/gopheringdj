package lib

import (
	"testing"

	. "github.com/smartystreets/goconvey/convey"
	"github.com/stretchr/testify/assert"
)

var singleSubs = []*Submission{{
	"TEST",
	"TEST",
	"TEST",
	"TEST",
	"TEST", "TEST", "TEST", "TEST", "TEST", "TEST",
	123.123,
	233,
	33,
	233,
	22,
	false,
	false,
}}

func Test_SingleDBInsert(t *testing.T) {
	Convey("Given a submission, insert and return timestamp", t, func() {

		a := assert.New(t)

		timestamp, err := InsertNewSubmissions(singleSubs)
		a.NoError(err)
		a.IsType(*new(string), timestamp)
	})
}

// func Test_SingleSubInsert(t *testing.T) {
// 	Convey("Given a submission, insert and return timestamp", t, func() {

// 	})
// }
