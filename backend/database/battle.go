package database

import (
	"math/rand"
	"time"

	uuid "github.com/satori/go.uuid"

	types "github.com/mthomasuk/terp-trermps/types"
)

// CreateBattle creates a new battle
func CreateBattle() (*types.Battle, error) {
	id := uuid.NewV4()

	_, err := Conn.NamedExec(`
		INSERT INTO "battle" (id)
    VALUES (:id)
  `,
		map[string]interface{}{"id": id.String()},
	)
	if err != nil {
		return nil, err
	}

	_, err = CreateRound(id.String(), "")
	if err != nil {
		return nil, err
	}

	rnd := types.Battle{}

	err = Conn.Get(
		&rnd, `SELECT * FROM "battle" WHERE "battle"."id" = $1`, id.String(),
	)
	if err != nil {
		return nil, err
	}

	return &rnd, nil
}

// RetrieveBattle retrieves a given battle
func RetrieveBattle(battleID, userID string) (*types.Battle, error) {
	bttl := types.Battle{}
	hnds := []types.Deck{}

	err := Conn.Get(
		&bttl, `SELECT * FROM "battle" WHERE "battle"."id" = $1`, battleID,
	)
	if err != nil {
		return nil, err
	}

	err = Conn.Select(
		&hnds,
		`SELECT "deck"."id",
      "user"."name",
      "user"."id" as "user_id"
    FROM "deck"
    INNER JOIN "user" ON "user"."id" = "deck"."user_id"
    WHERE "deck"."battle_id" = $1`,
		battleID,
	)
	if err != nil {
		return nil, err
	}

	bttl.Decks = hnds

	for idx, hnd := range hnds {
		if hnd.UserID == userID {
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
        FROM "card_in_deck"
        INNER JOIN "card" ON "card_in_deck"."card_id" = "card"."id"
        WHERE "card_in_deck"."deck_id" = $1
        ORDER BY "card_in_deck"."added_at" DESC`,
				hnd.ID,
			)
			if err != nil {
				return nil, err
			}

			bttl.Decks[idx].Cards = crds
		}
	}

	rnds, err := GetRounds(battleID)
	if err != nil {
		return nil, err
	}

	bttl.Rounds = *rnds

	return &bttl, nil
}

// StartBattle adds a started_at timestamp to a battle by id
func StartBattle(battleID string) (*types.Battle, error) {
	now := time.Now().Local()

	decks := []types.Deck{}
	udecks := []types.Deck{}

	err := Conn.Select(
		&decks, `SELECT id FROM "deck" WHERE "deck"."battle_id" = $1`, battleID,
	)
	if err != nil {
		return nil, err
	}

	var ids []string
	for _, deck := range decks {
		ids = append(ids, deck.ID)
	}

	err = GenerateDecks(ids)
	if err != nil {
		return nil, err
	}

	_, err = Conn.NamedExec(`
		UPDATE "battle" SET started_at = :started_at WHERE id = :id`,
		map[string]interface{}{
			"started_at": now,
			"id":         battleID,
		},
	)
	if err != nil {
		return nil, err
	}

	err = Conn.Select(
		&udecks,
		`SELECT user_id FROM "deck" WHERE "deck"."battle_id" = $1`,
		battleID,
	)
	if err != nil {
		return nil, err
	}

	rand.Seed(time.Now().Unix())
	leader := udecks[rand.Intn(len(udecks))].UserID

	_, err = Conn.NamedExec(`
		UPDATE "round" SET leader = :leader WHERE battle_id = :battle_id`,
		map[string]interface{}{
			"leader":    leader,
			"battle_id": battleID,
		},
	)
	if err != nil {
		return nil, err
	}

	bttl := types.Battle{}

	err = Conn.Get(
		&bttl, `SELECT * FROM "battle" WHERE "battle"."id" = $1`, battleID,
	)
	if err != nil {
		return nil, err
	}

	return &bttl, nil
}

// EndBattle updates the winner for a given battle
func EndBattle(winner string, battleID string) (*types.Battle, error) {
	_, err := Conn.NamedExec(`
		UPDATE "battle" SET winner = :winner WHERE id = :id`,
		map[string]interface{}{
			"winner": winner,
			"id":     battleID,
		},
	)
	if err != nil {
		return nil, err
	}

	rnd := types.Battle{}

	err = Conn.Get(
		&rnd, `SELECT * FROM "battle" WHERE "battle"."id" = $1`, battleID,
	)
	if err != nil {
		return nil, err
	}

	return &rnd, nil
}
