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

		battleID := c.Param("id")

		var msg struct {
			Type     string      `json:"type"`
			BattleID string      `json:"battle_id"`
			Card     *types.Card `json:"card,omitempty"`
			UserID   string      `json:"user_id,omitempy"`
			Name     string      `json:"name,omitempty"`
		}

		msg.BattleID = battleID

		if round.WinningHand.ID != "" {
			crd, err := database.GetCardByID(round.WinningHand.CardID)
			if err != nil {
				c.Logger().Error(err)
				return c.String(http.StatusServiceUnavailable, "Secret error I can't tell you about")
			}

			msg.Type = "winning-hand-played"
			msg.Card = crd
			msg.UserID = round.WinningHand.UserID
			msg.Name = round.WinningHand.Name
		} else {
			msg.Type = "round-is-a-draw"
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
