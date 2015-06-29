package lib

import "log"

type logger struct {
	// Map if service to color
	services map[string]string
}

var stdlog, errlog *log.Logger

func init() {

}

func (l logger) Print(service string, s string) {

}

func (l *logger) RegisterServices(service string, color string) {

}
