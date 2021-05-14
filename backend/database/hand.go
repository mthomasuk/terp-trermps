package database

import (
	"time"

	types "github.com/mthomasuk/terp-trermps/types"
)

// PlayHand submits your hand for a round
func PlayHand(roundID, deckID, cardID string) (*types.Round, error) {
	now := time.Now().Local()

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

	type count struct {
		Count int
	}

	hnds := []types.Hand{}
	err = Conn.Select(
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

	cntD := count{}

	err = Conn.Get(
		&cntD,
		`SELECT count(*) FROM "deck" WHERE "deck"."battle_id" = $1`,
		rnd.BattleID,
	)
	if err != nil {
		return nil, err
	}

	// Deal with a draw

	if len(hnds) == cntD.Count {
		win := hnds[0]

		for _, hand := range hnds[1:] {
			_, err = Conn.NamedExec(`
    		UPDATE "card_in_deck" SET deck_id = :win_deck_id, added_at = :added_at WHERE card_id = :card_id AND deck_id = :lose_deck_id`,
				map[string]interface{}{
					"win_deck_id":  win.DeckID,
					"added_at":     now,
					"card_id":      hand.CardID,
					"lose_deck_id": hand.DeckID,
				},
			)
			if err != nil {
				return nil, err
			}
		}

		_, err = CreateRound(rnd.BattleID, win.UserID)
		if err != nil {
			return nil, err
		}

		rnd.WinningHand = win
	}

	return &rnd, nil
}
