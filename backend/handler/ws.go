package handler

import (
	"net/http"

	"github.com/gorilla/websocket"

	echo "github.com/labstack/echo/v4"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func checkOrigin(r *http.Request) bool {
	return true
}

// WsHandler is a generic websocket handler
func WsHandler(hub *Hub) func(echo.Context) error {
	return func(c echo.Context) error {
		upgrader.CheckOrigin = checkOrigin

		conn, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
		if err != nil {
			conn.Close()

			return err
		}

		id := c.Param("id")

		client := &Client{
			hub:  hub,
			conn: conn,
			send: make(chan []byte, 256),
			id:   id,
		}

		client.hub.register <- client

		go client.writePump()
		go client.readPump()

		return nil
	}
}
