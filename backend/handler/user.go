package handler

import (
	"net/http"

	"github.com/gorilla/sessions"

	"github.com/labstack/echo-contrib/session"

	echo "github.com/labstack/echo/v4"
	database "github.com/mthomasuk/terp-trermps/database"
	types "github.com/mthomasuk/terp-trermps/types"
)

// LogUserIn tries to extract a user from the DB and return it
func LogUserIn(c echo.Context) error {
	u := new(types.User)
	if err := c.Bind(u); err != nil {
		return err
	}

	if u.Name == "" || u.Password == "" {
		return c.String(http.StatusForbidden, "Please provide a name and password")
	}

	user, err := database.InsertOrLoginUser(u.Name, u.Password)
	if err != nil {
		c.Logger().Error(err)
		return c.String(http.StatusForbidden, "Forbidden")
	}

	sess, _ := session.Get("session", c)
	sess.Options = &sessions.Options{
		Path:   "/",
		MaxAge: 86400 * 7,
	}

	sess.Values["userId"] = user.ID
	sess.Save(c.Request(), c.Response())

	return c.JSON(http.StatusOK, &user)
}
