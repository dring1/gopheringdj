package main

import (
	"log"
	"os"

	"github.com/gorilla/websocket"
	"github.com/mgutz/ansi"
)

type Hub struct {
	connections map[*websocket.Conn]bool
	register    chan *websocket.Conn
	unregister  chan *websocket.Conn
	broadcast   chan *Message
	logger      *log.Logger
}

type Message struct {
	Type string      `json:"type"`
	Data interface{} `json:"data"`
}

var (
	Green = ansi.ColorFunc("green+")
	hub   = Hub{
		connections: make(map[*websocket.Conn]bool),
		register:    make(chan *websocket.Conn),
		unregister:  make(chan *websocket.Conn),
		broadcast:   make(chan *Message),
		logger:      log.New(os.Stdout, Green("[Hub]: "), log.Ldate|log.Ltime),
	}
)

func (h *Hub) addConnection(conn *websocket.Conn) {
	h.connections[conn] = true
	h.logger.Println("Connection Added")
}

func (h *Hub) removeConnection(conn *websocket.Conn) {
	h.logger.Println("Connection Removed")
	delete(h.connections, conn)
}

func (h *Hub) BroadcastMessage(m *Message) {

	for c := range h.connections {
		go func(connection *websocket.Conn) {

			if err := connection.WriteJSON(m); err != nil {
				h.removeConnection(connection)
			}

		}(c)
	}
}

func (h *Hub) run() {
	for {
		select {
		case c := <-h.register:
			h.addConnection(c)
		case c := <-h.unregister:
			if _, ok := h.connections[c]; ok {
				h.removeConnection(c)
			}
		case m := <-h.broadcast:
			h.BroadcastMessage(m)
		}
	}
}
