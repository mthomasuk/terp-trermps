package database

import (
	"time"

	uuid "github.com/satori/go.uuid"

	types "github.com/mthomasuk/terp-trermps/types"
)

// GetRounds retrieves all card rows from the DB
func GetRounds(battleID string) (*[]types.Round, error) {
	rnds := []types.Round{}

	err := Conn.Select(
		&rnds,
		`SELECT * FROM "round" WHERE "round"."battle_id" = $1 ORDER BY "round"."started_at" DESC LIMIT 1`,
		battleID,
	)
	if err != nil {
		return nil, err
	}

	for idx, rnd := range rnds {
		win := types.Hand{}

		err = Conn.Get(
			&win,
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
      ORDER BY value DESC
      LIMIT 1`,
			rnd.ID,
		)
		if err != nil {
			if err.Error() != noSQLResults {
				return nil, err
			}
		} else {
			rnds[idx].WinningHand = win
		}
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

// HandleDraw swaps cards out of the users decks and wipes the round clean
func HandleDraw(roundID string, hands []types.Hand) error {
	var err error

	for _, hand := range hands {
		_, err = Conn.NamedExec(`
			UPDATE "card_in_deck"
      SET deck_id = NULL, piled = :piled
      WHERE card_id = :card_id AND deck_id = :deck_id`,
			map[string]interface{}{
				"piled":   roundID,
				"card_id": hand.CardID,
				"deck_id": hand.DeckID,
			},
		)
		if err != nil {
			return err
		}

		_, err = Conn.NamedExec(`
			DELETE FROM "hand" WHERE card_id = :card_id AND deck_id = :deck_id AND round_id = :round_id`,
			map[string]interface{}{
				"card_id":  hand.CardID,
				"deck_id":  hand.DeckID,
				"round_id": roundID,
			},
		)
		if err != nil {
			return err
		}

		_, err = Conn.Exec(`
			UPDATE "round" SET attribute = NULL WHERE id = :round_id`,
			map[string]interface{}{"round_id": roundID},
		)
		if err != nil {
			return err
		}
	}

	return nil
}

// HandleWin moves the losing cards into the winners deck, and clears up
// any "piled" cards
func HandleWin(
	round *types.Round,
	hands []types.Hand,
	winner types.Hand,
) error {
	var err error

	now := time.Now().Local()

	_, err = Conn.NamedExec(`
		UPDATE "card_in_deck"
    SET added_at = :added_at
    WHERE card_id = :card_id AND deck_id = :deck_id
  `,
		map[string]interface{}{
			"added_at": now,
			"card_id":  winner.CardID,
			"deck_id":  winner.DeckID,
		},
	)
	if err != nil {
		return err
	}

	for _, hand := range hands[1:] {
		_, err = Conn.NamedExec(`
			UPDATE "card_in_deck"
      SET deck_id = :win_deck_id, added_at = :added_at
      WHERE card_id = :card_id AND deck_id = :lose_deck_id
      OR deck_id IS NULL AND piled = :piled`,
			map[string]interface{}{
				"win_deck_id":  winner.DeckID,
				"added_at":     now,
				"card_id":      hand.CardID,
				"lose_deck_id": hand.DeckID,
				"piled":        round.ID,
			},
		)
		if err != nil {
			return err
		}
	}

	_, err = CreateRound(round.BattleID, winner.UserID)
	if err != nil {
		return err
	}

	round.WinningHand = winner

	hasWon, win, err := CheckForWinningDeck(round.BattleID)
	if err != nil {
		return err
	}

	// The highest counted hand equals the total number of cards
	if hasWon {
		_, err = Conn.NamedExec(`
			UPDATE "battle" SET winner = :winner WHERE id = :id`,
			map[string]interface{}{
				"winner": win,
				"id":     round.BattleID,
			},
		)
		if err != nil {
			return err
		}
	}

	return nil
}
