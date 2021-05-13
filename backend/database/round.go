package database

import (
	types "github.com/mthomasuk/terp-trermps/types"
)

// GetRounds retrieves all card rows from the DB
func GetRounds(battleID string) (*[]types.Round, error) {
	rnds := []types.Round{}

	err := Conn.Select(&rnds, `SELECT * FROM "round" WHERE "round"."battle_id" = $1`, battleID)
	if err != nil {
		return nil, err
	}

	return &rnds, nil
}

// SetAttribute sets an attribute for the round
func SetAttribute(roundID, attribute string) error {
	_, err := Conn.NamedExec(`
		UPDATE "round" SET attribute = :attribute WHERE id = :id`,
		map[string]interface{}{
			"attribute": attribute,
			"id":        roundID,
		},
	)
	if err != nil {
		return err
	}

	return nil
}
