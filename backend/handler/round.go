package handler

import (
	"encoding/json"
	"net/http"

	"github.com/labstack/echo-contrib/session"

	echo "github.com/labstack/echo/v4"
	database "github.com/mthomasuk/terp-trermps/database"
	types "github.com/mthomasuk/terp-trermps/types"
)

// CreateRound creates a round and returns it
func CreateRound(c echo.Context) error {
	sess, _ := session.Get("session", c)

	_, ok := sess.Values["userId"].(string)
	if !ok {
		c.Logger().Error("Couldn't extract userID from session")
		return c.String(http.StatusForbidden, "Forbidden")
	}

	round, err := database.CreateRound()
	if err != nil {
		c.Logger().Error(err)
		return c.String(http.StatusBadRequest, "Failed to create round")
	}

	return c.JSON(http.StatusOK, &round)
}

// RoundStart starts a round (natch)
func RoundStart(hub *Hub) func(echo.Context) error {
	return func(c echo.Context) error {
		sess, _ := session.Get("session", c)

		_, ok := sess.Values["userId"].(string)
		if !ok {
			c.Logger().Error("Couldn't extract userID from session")
			return c.String(http.StatusForbidden, "Forbidden")
		}

		roundID := c.Param("id")

		round, err := database.StartRound(roundID)
		if err != nil {
			c.Logger().Error(err)
			return c.String(http.StatusNotFound, "Not found")
		}

		msg := struct {
			Type string `json:"type"`
			ID   string `json:"id"`
		}{
			Type: "round-started",
			ID:   roundID,
		}

		b, err := json.Marshal(msg)
		if err != nil {
			c.Logger().Error(err)
			return c.String(http.StatusServiceUnavailable, "Secret error I can't tell you about")
		}

		hub.broadcast <- b

		return c.JSON(http.StatusOK, &round)
	}
}

// RoundEnd ends a round (natch)
func RoundEnd(hub *Hub) func(echo.Context) error {
	return func(c echo.Context) error {
		sess, _ := session.Get("session", c)

		_, ok := sess.Values["userId"].(string)
		if !ok {
			c.Logger().Error("Couldn't extract userID from session")
			return c.String(http.StatusForbidden, "Forbidden")
		}

		u := new(types.User)
		if err := c.Bind(u); err != nil {
			return err
		}

		roundID := c.Param("id")

		round, err := database.EndRound(u.ID, roundID)
		if err != nil {
			c.Logger().Error(err)
			return c.String(http.StatusNotFound, "Not found")
		}

		msg := struct {
			Type string `json:"type"`
			ID   string `json:"id"`
		}{
			Type: "round-ended",
			ID:   roundID,
		}

		b, err := json.Marshal(msg)
		if err != nil {
			c.Logger().Error(err)
			return c.String(http.StatusServiceUnavailable, "Secret error I can't tell you about")
		}

		hub.broadcast <- b

		return c.JSON(http.StatusOK, &round)
	}
}
