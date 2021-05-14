package database

import (
	uuid "github.com/satori/go.uuid"

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

// CreateRound instansiates a new round row in the DB
func CreateRound(battleID, userID string) (*types.Round, error) {
	id := uuid.NewV4()

	var err error

	if userID != "" {
		_, err = Conn.NamedExec(`
  		INSERT INTO "round" (id,battle_id,leader)
      VALUES (:id,:battle_id,:leader)
    `,
			map[string]interface{}{
				"id":        id,
				"battle_id": battleID,
				"leader":    userID,
			},
		)
		if err != nil {
			return nil, err
		}
	} else {
		_, err = Conn.NamedExec(`
  		INSERT INTO "round" (id,battle_id)
      VALUES (:id,:battle_id)
    `,
			map[string]interface{}{
				"id":        id,
				"battle_id": battleID,
			},
		)
		if err != nil {
			return nil, err
		}
	}

	rnd := types.Round{}

	err = Conn.Get(&rnd, `SELECT * FROM "round" WHERE "round"."id" = $1`, id)
	if err != nil {
		return nil, err
	}

	return &rnd, nil
}

// SetAttribute sets an attribute for the round
func SetAttribute(roundID, attribute string) (*types.Round, error) {
	_, err := Conn.NamedExec(`
		UPDATE "round" SET attribute = :attribute WHERE id = :id`,
		map[string]interface{}{
			"attribute": attribute,
			"id":        roundID,
		},
	)
	if err != nil {
		return nil, err
	}

	rnd := types.Round{}

	err = Conn.Get(&rnd, `SELECT * FROM "round" WHERE "round"."id" = $1`, roundID)
	if err != nil {
		return nil, err
	}

	return &rnd, nil
}
