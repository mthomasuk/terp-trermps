package database

import (
	"errors"

	uuid "github.com/satori/go.uuid"

	helpers "github.com/mthomasuk/terp-trermps/helpers"
	types "github.com/mthomasuk/terp-trermps/types"
)

// GetUserByID retrieves an existing user by id column
func GetUserByID(id string) (*types.User, error) {
	u := types.User{}

	err := Conn.Get(&u, `SELECT * FROM "user" WHERE id = $1`, id)
	if err != nil {
		return nil, err
	}

	return &u, nil
}

// InsertOrLoginUser retrieves an existing user, or inserts a new one
func InsertOrLoginUser(name string, password string) (*types.User, error) {
	u := types.User{}

	err := Conn.Get(&u, `SELECT * FROM "user" WHERE name = $1`, name)
	if err != nil {
		// No user found, let's insert a new one
		if err.Error() != noSQLResults {
			return nil, err
		}

		id := uuid.NewV4()

		hashed, err := helpers.GenerateHash(password)
		if err != nil {
			return nil, err
		}

		_, err = Conn.NamedExec(`
  		INSERT INTO "user" (id,name,password) VALUES (:id,:name,:password)`,
			map[string]interface{}{
				"id":       id.String(),
				"name":     name,
				"password": hashed,
			},
		)
		if err != nil {
			return nil, err
		}

		err = Conn.Get(&u, `SELECT id, name FROM "user" WHERE id = $1`, id)
		if err != nil {
			return nil, err
		}

		return &u, nil
	}

	valid := helpers.ValidatePassword(password, u.Password)

	if valid {
		return &u, nil
	}

	return nil, errors.New("Invalid username or password")
}
