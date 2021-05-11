package database

import (
	"time"

	uuid "github.com/satori/go.uuid"

	types "github.com/mthomasuk/terp-trermps/types"
)

// CreateRound creates a new round
func CreateRound() (*types.Round, error) {
	id := uuid.NewV4()

	_, err := Conn.NamedExec(`
		INSERT INTO "round" (id)
    VALUES (:id)
  `,
		map[string]interface{}{"id": id.String()},
	)
	if err != nil {
		return nil, err
	}

	rnd := types.Round{}

	err = Conn.Get(
		&rnd, `SELECT * FROM "round" WHERE "round"."id" = $1`, id,
	)
	if err != nil {
		return nil, err
	}

	return &rnd, nil
}

// StartRound adds a started_at timestamp to a round by id
func StartRound(roundID string) (*types.Round, error) {
	now := time.Now().Local()
	hnd := []types.Hand{}

	err := Conn.Get(
		&hnd, `SELECT id FROM "hand" WHERE "hand"."round_id" = $1`, roundID,
	)
	if err != nil {
		return nil, err
	}

	var ids []string
	for _, hand := range hnd {
		ids = append(ids, hand.ID)
	}

	err = GenerateDecks(ids)
	if err != nil {
		return nil, err
	}

	_, err = Conn.NamedExec(`
		UPDATE "round" SET started_at = :started_at WHERE id = :id`,
		map[string]interface{}{
			"started_at": now,
			"id":         roundID,
		},
	)
	if err != nil {
		return nil, err
	}

	rnd := types.Round{}

	err = Conn.Get(
		&rnd, `SELECT * FROM "round" WHERE "round"."id" = $1`, roundID,
	)
	if err != nil {
		return nil, err
	}

	return &rnd, nil
}

// EndRound updates the winner for a given round
func EndRound(winner string, roundID string) (*types.Round, error) {
	_, err := Conn.NamedExec(`
		UPDATE "round" SET winner = :winner WHERE id = :id`,
		map[string]interface{}{
			"winner": winner,
			"id":     roundID,
		},
	)
	if err != nil {
		return nil, err
	}

	rnd := types.Round{}

	err = Conn.Get(
		&rnd, `SELECT * FROM "round" WHERE "round"."id" = $1`, roundID,
	)
	if err != nil {
		return nil, err
	}

	return &rnd, nil
}
