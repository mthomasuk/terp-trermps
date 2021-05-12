package server

import (
	"github.com/labstack/echo-contrib/session"

	echo "github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"github.com/gorilla/sessions"

	handler "github.com/mthomasuk/terp-trermps/handler"
)

// HTTPServer runs an Echo server on a given port
func HTTPServer(port string) {
	e := echo.New()

	e.Use(middleware.Recover())

	e.Use(session.Middleware(sessions.NewCookieStore([]byte("poopyass"))))

	e.POST("/api/login", handler.LogUserIn)

	e.POST("/api/round/new", handler.CreateRound)
	e.GET("/api/round/:id", handler.RoundByID)

	e.POST("/api/hand/:id", handler.JoinRound(hub))

	e.POST("/api/round/:id/start", handler.RoundStart(hub))
	e.POST("/api/round/:id/end", handler.RoundEnd(hub))

	e.Logger.Fatal(e.Start(port))
}
