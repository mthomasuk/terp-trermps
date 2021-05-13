package handler

import (
	"net/http"

	"github.com/labstack/echo-contrib/session"

	echo "github.com/labstack/echo/v4"
	database "github.com/mthomasuk/terp-trermps/database"
)

// SetRoundAttribute sets the attribute for the round
func SetRoundAttribute(c echo.Context) error {
	sess, _ := session.Get("session", c)

	_, ok := sess.Values["userId"].(string)
	if !ok {
		c.Logger().Error("Couldn't extract userID from session")
		return c.String(http.StatusForbidden, "Forbidden")
	}

	type attr struct {
		Attribute string `json:"attribute"`
	}

	u := new(attr)
	if err := c.Bind(u); err != nil {
		return err
	}

	if u.Attribute == "" {
		return c.String(http.StatusBadRequest, "Request missing fields")
	}

	roundID := c.Param("id")

	err := database.SetAttribute(roundID, u.Attribute)
	if err != nil {
		c.Logger().Error(err)
		return c.String(http.StatusBadRequest, "Request missing fields")
	}

	return c.JSON(http.StatusOK, "ok")
}
