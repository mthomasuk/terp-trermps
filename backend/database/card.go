package database

import (
	types "github.com/mthomasuk/terp-trermps/types"
)

// GetAllCards retrieves all card rows from the DB
func GetAllCards() (*[]types.Card, error) {
	crds := []types.Card{}

	err := Conn.Select(&crds, `SELECT * FROM "card"`)
	if err != nil {
		return nil, err
	}

	return &crds, nil
}
