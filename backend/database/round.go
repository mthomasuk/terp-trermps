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

// RetrieveRound retrieves a given round
func RetrieveRound(roundID, userID string) (*types.Round, error) {
	rnd := types.Round{}
	hnds := []types.Hand{}

	err := Conn.Get(
		&rnd, `SELECT * FROM "round" WHERE "round"."id" = $1`, roundID,
	)
	if err != nil {
		return nil, err
	}

	err = Conn.Select(
		&hnds,
		`SELECT "hand"."id",
      "user"."name",
      "user"."id" as "user_id"
    FROM "hand"
    INNER JOIN "user" ON "user"."id" = "hand"."user_id"
    WHERE "hand"."round_id" = $1 AND "hand"."user_id" = $2`,
		roundID,
		userID,
	)
	if err != nil {
		return nil, err
	}

	rnd.Hands = hnds

	for idx, hnd := range hnds {
		crds := []types.Card{}

		err := Conn.Select(
			&crds,
			`SELECT "card"."id",
        "card"."name",
        "card"."type",
        "card"."strength",
        "card"."skill",
        "card"."magical_force",
        "card"."weapons",
        "card"."power"
      FROM "card_in_hand"
      INNER JOIN "card" ON "card_in_hand"."card_id" = "card"."id"
      WHERE "card_in_hand"."hand_id" = $1`,
			hnd.ID,
		)
		if err != nil {
			return nil, err
		}

		rnd.Hands[idx].Cards = crds
	}

	return &rnd, nil
}

// StartRound adds a started_at timestamp to a round by id
func StartRound(roundID string) (*types.Round, error) {
	now := time.Now().Local()
	hnd := []types.Hand{}

	err := Conn.Select(
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
