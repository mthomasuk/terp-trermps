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
	e.Use(middleware.Gzip())

	e.Use(session.Middleware(sessions.NewCookieStore([]byte("poopyass"))))

	e.POST("/api/login", handler.LogUserIn)

	e.POST("/api/battle/new", handler.CreateBattle)
	e.GET("/api/battle/:id", handler.BattleByID)

	e.POST("/api/battle/:id", handler.JoinBattle(hub))

	e.POST("/api/battle/:id/start", handler.BattleStart(hub))
	e.POST("/api/battle/:id/end", handler.BattleEnd(hub))

	e.POST("/api/round/:id/attribute", handler.SetRoundAttribute(hub))

	e.POST("/api/hand/:id", handler.PlayHand(hub))

	e.Logger.Fatal(e.Start(port))
}
