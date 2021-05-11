package main

import (
	database "github.com/mthomasuk/terp-trermps/database"
	server "github.com/mthomasuk/terp-trermps/server"
)

func main() {
	// Initialise the DB and run migrations if necessary
	database.Run()

	// Startup our WebSocket server
	go func() {
		server.WSServer(":4002")
	}()

	// Startup our HTTP server
	server.HTTPServer(":4001")
}
