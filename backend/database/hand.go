package database

import (
	types "github.com/mthomasuk/terp-trermps/types"
)

type count struct {
	Count int
}

// GetHandsByRound retrieves all hands for a given round
func GetHandsByRound(roundID string) ([]types.Hand, error) {
	hnds := []types.Hand{}

	err := Conn.Select(
		&hnds,
		`SELECT "hand"."id",
			"hand"."deck_id",
			"hand"."round_id",
			"hand"."card_id",
			"hand"."value",
			"user"."id" AS "user_id",
			"user"."name" AS "name"
		FROM "hand"
		INNER JOIN "deck" ON "hand"."deck_id" = "deck"."id"
		INNER JOIN "user" ON "deck"."user_id" = "user"."id"
		WHERE "hand"."round_id" = $1
		ORDER BY value DESC`,
		roundID,
	)
	if err != nil {
		return nil, err
	}

	return hnds, nil
}

// PlayHand submits your hand for a round
func PlayHand(roundID, deckID, cardID string) (*types.Round, error) {
	rnd := types.Round{}
	err := Conn.Get(&rnd, `SELECT * FROM "round" WHERE "round"."id" = $1`, roundID)
	if err != nil {
		return nil, err
	}

	crd := types.Card{}
	err = Conn.Get(&crd, `SELECT * FROM "card" WHERE "card"."id" = $1`, cardID)
	if err != nil {
		return nil, err
	}

	var value int

	if rnd.Attribute.String == "strength" {
		value = crd.Strength
	} else if rnd.Attribute.String == "skill" {
		value = crd.Skill
	} else if rnd.Attribute.String == "magical_force" {
		value = crd.MagicalForce
	} else if rnd.Attribute.String == "weapons" {
		value = crd.Weapons
	} else if rnd.Attribute.String == "power" {
		value = crd.Power
	}

	_, err = Conn.NamedExec(`
		INSERT INTO "hand" (deck_id, round_id, card_id, value)
		VALUES (:deck_id, :round_id, :card_id, :value)
  `,
		map[string]interface{}{
			"deck_id":  deckID,
			"round_id": roundID,
			"card_id":  cardID,
			"value":    value,
		},
	)
	if err != nil {
		return nil, err
	}

	hnds, err := GetHandsByRound(roundID)
	if err != nil {
		return nil, err
	}

	cntD := count{}

	err = Conn.Get(
		&cntD,
		`SELECT count(*) FROM "deck" WHERE "deck"."battle_id" = $1`,
		rnd.BattleID,
	)
	if err != nil {
		return nil, err
	}

	// Everyone has played a hand
	if len(hnds) >= cntD.Count {
		win := hnds[0]

		if win.Value == hnds[1].Value {
			// It's a draw
			err = HandleDraw(roundID, hnds)
			if err != nil {
				return nil, err
			}

			rnd.IsDraw = true
		} else {
			// There's a clear winner
			err = HandleWin(&rnd, hnds, win)
			if err != nil {
				return nil, err
			}

			rnd.IsDraw = false
		}
	}

	return &rnd, nil
}
