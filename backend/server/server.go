package server

import (
	handler "github.com/mthomasuk/terp-trermps/handler"
)

var hub *handler.Hub

func init() {
	hub = handler.CreateHub()
	go hub.Run()
}
