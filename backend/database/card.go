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

// GetCardByID retrieves a card row from the DB
func GetCardByID(cardID string) (*types.Card, error) {
	crd := types.Card{}

	err := Conn.Get(&crd, `SELECT * FROM "card" WHERE "card"."id" = $1`, cardID)
	if err != nil {
		return nil, err
	}

	return &crd, nil
}
