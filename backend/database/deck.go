package database

import (
	"math/rand"
	"time"

	uuid "github.com/satori/go.uuid"

	types "github.com/mthomasuk/terp-trermps/types"
)

func chunkCards(slice []types.Card, chunkSize int) [][]types.Card {
	var chunks [][]types.Card
	for i := 0; i < len(slice); i += chunkSize {
		end := i + chunkSize

		if end > len(slice) {
			end = len(slice)
		}

		chunks = append(chunks, slice[i:end])
	}

	return chunks
}

// CreateDeck creates a new deck for a given user in a given battle
func CreateDeck(userID, battleID string) (*types.Deck, error) {
	hnd := types.Deck{}

	err := Conn.Get(
		&hnd,
		`SELECT * FROM "deck" WHERE "deck"."battle_id" = $1 AND "deck"."user_id" = $2`,
		battleID,
		userID,
	)
	if err != nil {
		if err.Error() != "sql: no rows in result set" {
			return nil, err
		}

		id := uuid.NewV4()

		_, err := Conn.NamedExec(`
  		INSERT INTO "deck" (id,user_id,battle_id)
      VALUES (:id,:user_id,:battle_id)
    `,
			map[string]interface{}{
				"id":        id.String(),
				"user_id":   userID,
				"battle_id": battleID,
			},
		)
		if err != nil {
			return nil, err
		}

		err = Conn.Get(
			&hnd, `SELECT * FROM "deck" WHERE "deck"."id" = $1`, id,
		)
		if err != nil {
			return nil, err
		}

		return &hnd, nil
	}

	return &hnd, nil
}

// AddCardToDeck associates a given card with a given deck
func AddCardToDeck(cardID, deckID string) error {
	now := time.Now().Local()

	_, err := Conn.NamedExec(`
		INSERT INTO "card_in_deck" (card_id,deck_id,added_at)
    VALUES (:card_id,:deck_id,:added_at)
  `,
		map[string]interface{}{
			"card_id":  cardID,
			"deck_id":  deckID,
			"added_at": now,
		},
	)
	if err != nil {
		return err
	}

	return nil
}

// RetrieveDeck retrieves a given deck and assigned cards
func RetrieveDeck(deckID string) (*types.Deck, error) {
	hnd := types.Deck{}

	err := Conn.Get(
		&hnd, `SELECT * FROM "deck" WHERE "deck"."id" = $1`, deckID,
	)
	if err != nil {
		return nil, err
	}

	crds := []types.Card{}

	err = Conn.Select(&crds, `SELECT * FROM "card_in_deck" WHERE "deck"."id" = $1 ORDER BY "deck"."added_at" ASC`, deckID)
	if err != nil {
		return nil, err
	}

	hnd.Cards = crds

	return &hnd, nil
}

// GenerateDecks iterates over some decks and adds random cards to them
func GenerateDecks(decks []string) error {
	crds, err := GetAllCards()
	if err != nil {
		return err
	}

	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(*crds), func(i, j int) { (*crds)[i], (*crds)[j] = (*crds)[j], (*crds)[i] })

	chunks := chunkCards(*crds, int(len(*crds)/len(decks)))

	dealt := make(map[string]bool)

	for idx, chunk := range chunks {
		for _, card := range chunk {
			if dealt[card.ID] {
				continue
			}

			err = AddCardToDeck(card.ID, decks[idx])
			if err != nil {
				break
			}

			dealt[card.ID] = true
		}
	}

	return nil
}

// CheckForWinningDeck returns a boolean and UserID if a winner is found
func CheckForWinningDeck(battleID string) (bool, string, error) {
	cntW := []types.CardsLeftInDeck{}
	cntC := count{}

	err := Conn.Select(
		&cntW,
		`SELECT "deck"."id" AS "deck_id",
			"user"."id" AS "user_id",
			count("card_in_deck"."card_id")
		FROM "deck"
		INNER JOIN "card_in_deck" ON "deck"."id" = "card_in_deck"."deck_id"
		INNER JOIN "user" ON "deck"."user_id" = "user"."id"
		WHERE "deck"."battle_id" = $1
		GROUP BY "deck"."id", "user"."id"
		ORDER BY count DESC`,
		battleID,
	)
	if err != nil {
		return false, "", err
	}

	err = Conn.Get(&cntC, `SELECT count(id) FROM "card"`)
	if err != nil {
		return false, "", err
	}

	if cntW[0].Count == cntC.Count {
		return true, cntW[0].UserID, nil
	}

	return false, "", nil
}
