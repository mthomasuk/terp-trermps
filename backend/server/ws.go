package server

import (
	"github.com/labstack/echo-contrib/session"

	echo "github.com/labstack/echo/v4"

	"github.com/gorilla/sessions"

	handler "github.com/mthomasuk/terp-trermps/handler"
)

// WSServer runs an Echo server on a given port
func WSServer(port string) {
	ws := echo.New()

	ws.Use(session.Middleware(sessions.NewCookieStore([]byte("poopyass"))))

	ws.GET("/:id", handler.WsHandler(hub))

	ws.Logger.Fatal(ws.Start(port))
}
