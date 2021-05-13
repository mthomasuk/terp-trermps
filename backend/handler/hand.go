package handler

import (
	"encoding/json"
	"net/http"

	"github.com/labstack/echo-contrib/session"

	echo "github.com/labstack/echo/v4"
	database "github.com/mthomasuk/terp-trermps/database"
	types "github.com/mthomasuk/terp-trermps/types"
)

// PlayHand handles a hand post message and passes it to the DB
func PlayHand(hub *Hub) func(echo.Context) error {
	return func(c echo.Context) error {
		sess, _ := session.Get("session", c)

		_, ok := sess.Values["userId"].(string)
		if !ok {
			c.Logger().Error("Couldn't extract userID from session")
			return c.String(http.StatusForbidden, "Forbidden")
		}

		h := new(types.Hand)
		if err := c.Bind(h); err != nil {
			return err
		}

		if h.RoundID == "" || h.DeckID == "" || h.CardID == "" {
			return c.String(http.StatusBadRequest, "Request missing fields")
		}

		round, err := database.PlayHand(h.RoundID, h.DeckID, h.CardID)
		if err != nil {
			c.Logger().Error(err)
			return c.String(http.StatusBadRequest, "Failed to submit hand")
		}

		if round.WinningHand.ID != "" {
			battleID := c.Param("id")

			msg := struct {
				Type     string `json:"type"`
				BattleID string `json:"battle_id"`
				UserID   string `json:"user_id"`
				Name     string `json:"name"`
			}{
				Type:     "winning-hand-played",
				BattleID: battleID,
				UserID:   round.WinningHand.UserID,
				Name:     round.WinningHand.Name,
			}

			b, err := json.Marshal(msg)
			if err != nil {
				c.Logger().Error(err)
				return c.String(http.StatusServiceUnavailable, "Secret error I can't tell you about")
			}

			hub.broadcast <- b
		}

		// Move other cards into this deck, broadcast decks

		return c.JSON(http.StatusOK, &round)
	}
}
