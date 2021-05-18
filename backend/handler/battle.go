package handler

import (
	"encoding/json"
	"net/http"

	"github.com/labstack/echo-contrib/session"

	echo "github.com/labstack/echo/v4"
	database "github.com/mthomasuk/terp-trermps/database"
	types "github.com/mthomasuk/terp-trermps/types"
)

// CreateBattle creates a battle and returns it
func CreateBattle(c echo.Context) error {
	sess, _ := session.Get("session", c)

	userID, ok := sess.Values["userId"].(string)
	if !ok {
		c.Logger().Error("Couldn't extract userID from session")
		return c.String(http.StatusForbidden, "Forbidden")
	}

	battle, err := database.CreateBattle()
	if err != nil {
		c.Logger().Error(err)
		return c.String(http.StatusBadRequest, "Failed to create battle")
	}

	_, err = database.CreateDeck(userID, battle.ID)
	if err != nil {
		c.Logger().Error(err)
		return c.String(http.StatusBadRequest, "Failed to create deck")
	}

	return c.JSON(http.StatusOK, &battle)
}

// BattleByID retrieves a battle by it's id
func BattleByID(c echo.Context) error {
	sess, _ := session.Get("session", c)

	userID, ok := sess.Values["userId"].(string)
	if !ok {
		c.Logger().Error("Couldn't extract userID from session")
		return c.String(http.StatusForbidden, "Forbidden")
	}

	battleID := c.Param("id")

	battle, err := database.RetrieveBattle(battleID, userID)
	if err != nil {
		c.Logger().Error(err)
		return c.String(http.StatusNotFound, "Not found")
	}

	return c.JSON(http.StatusOK, &battle)
}

// JoinBattle creates a hand for a given battle and returns it
func JoinBattle(hub *Hub) func(echo.Context) error {
	return func(c echo.Context) error {
		sess, _ := session.Get("session", c)

		userID, ok := sess.Values["userId"].(string)
		if !ok {
			c.Logger().Error("Couldn't extract userID from session")
			return c.String(http.StatusForbidden, "Forbidden")
		}

		battleID := c.Param("id")

		battle, err := database.CreateDeck(userID, battleID)
		if err != nil {
			c.Logger().Error(err)
			return c.String(http.StatusBadRequest, "Failed to create battle")
		}

		user, err := database.GetUserByID(userID)
		if err != nil {
			c.Logger().Error(err)
			return c.String(http.StatusBadRequest, "Failed to retrieve user")
		}

		msg := struct {
			Type     string `json:"type"`
			BattleID string `json:"battle_id"`
			UserID   string `json:"user_id"`
			Name     string `json:"name"`
		}{
			Type:     "user-joined-battle",
			BattleID: battleID,
			UserID:   user.ID,
			Name:     user.Name,
		}

		b, err := json.Marshal(msg)
		if err != nil {
			c.Logger().Error(err)
			return c.String(http.StatusServiceUnavailable, "Secret error I can't tell you about")
		}

		hub.broadcast <- b

		return c.JSON(http.StatusOK, &battle)
	}
}

// BattleStart starts a battle (natch)
func BattleStart(hub *Hub) func(echo.Context) error {
	return func(c echo.Context) error {
		sess, _ := session.Get("session", c)

		_, ok := sess.Values["userId"].(string)
		if !ok {
			c.Logger().Error("Couldn't extract userID from session")
			return c.String(http.StatusForbidden, "Forbidden")
		}

		battleID := c.Param("id")

		battle, err := database.StartBattle(battleID)
		if err != nil {
			c.Logger().Error(err)
			return c.String(http.StatusNotFound, "Not found")
		}

		msg := struct {
			Type     string `json:"type"`
			BattleID string `json:"battle_id"`
		}{
			Type:     "battle-started",
			BattleID: battleID,
		}

		b, err := json.Marshal(msg)
		if err != nil {
			c.Logger().Error(err)
			return c.String(http.StatusServiceUnavailable, "Secret error I can't tell you about")
		}

		hub.broadcast <- b

		return c.JSON(http.StatusOK, &battle)
	}
}

// BattleEnd ends a battle (natch)
func BattleEnd(hub *Hub) func(echo.Context) error {
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

		battleID := c.Param("id")

		battle, err := database.EndBattle(u.ID, battleID)
		if err != nil {
			c.Logger().Error(err)
			return c.String(http.StatusNotFound, "Not found")
		}

		msg := struct {
			Type string `json:"type"`
			ID   string `json:"id"`
		}{
			Type: "battle-ended",
			ID:   battleID,
		}

		b, err := json.Marshal(msg)
		if err != nil {
			c.Logger().Error(err)
			return c.String(http.StatusServiceUnavailable, "Secret error I can't tell you about")
		}

		hub.broadcast <- b

		return c.JSON(http.StatusOK, &battle)
	}
}
