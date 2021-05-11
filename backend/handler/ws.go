package handler

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo-contrib/session"

	echo "github.com/labstack/echo/v4"
	database "github.com/mthomasuk/terp-trermps/database"
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

		client := &Client{
			hub:  hub,
			conn: conn,
			send: make(chan []byte, 256),
		}

		client.hub.register <- client

		go client.writePump()
		go client.readPump()

		sess, _ := session.Get("session", c)

		if sess.Values["userId"] != nil {
			userID := fmt.Sprintf("%v", sess.Values["userId"])

			user, err := database.GetUserByID(userID)
			if err != nil {
				conn.Close()

				c.Logger().Error(err)
				return err
			}

			msg := struct {
				Type string `json:"type"`
				ID   string `json:"id"`
				Name string `json:"name"`
			}{
				Type: "user-joined",
				ID:   user.ID,
				Name: user.Name,
			}

			b, err := json.Marshal(msg)
			if err != nil {
				conn.Close()

				c.Logger().Error(err)
				return err
			}

			client.hub.broadcast <- b
		}

		return nil
	}
}
