package model

import "github.com/jinzhu/gorm"

type Song struct {
	gorm.Model
	Name string
}
