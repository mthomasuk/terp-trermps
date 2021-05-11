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

// CreateHand creates a new hand for a given user in a given round
func CreateHand(userID, roundID string) (*types.Hand, error) {
	id := uuid.NewV4()

	_, err := Conn.NamedExec(`
		INSERT INTO "hand" (id,user_id,round_id)
    VALUES (:id,:user_id,:round_id)
  `,
		map[string]interface{}{
			"id":       id.String(),
			"user_id":  userID,
			"round_id": roundID,
		},
	)
	if err != nil {
		return nil, err
	}

	hnd := types.Hand{}

	err = Conn.Get(
		&hnd, `SELECT * FROM "hand" WHERE "hand"."id" = $1`, id,
	)
	if err != nil {
		return nil, err
	}

	return &hnd, nil
}

// AddCardToHand associates a given card with a given hand
func AddCardToHand(cardID, handID string) error {
	_, err := Conn.NamedExec(`
		INSERT INTO "card_in_hand" (card_id,hand_id)
    VALUES (:card_id,:hand_id)
  `,
		map[string]interface{}{
			"card_id": cardID,
			"hand_id": handID,
		},
	)
	if err != nil {
		return err
	}

	return nil
}

// RetrieveHand retrieves a given hand and assigned cards
func RetrieveHand(handID string) (*types.Hand, error) {
	hnd := types.Hand{}

	err := Conn.Get(
		&hnd, `SELECT * FROM "hand" WHERE "hand"."id" = $1`, handID,
	)
	if err != nil {
		return nil, err
	}

	crds := []types.Card{}

	err = Conn.Select(&crds, `SELECT * FROM "card_in_hand" WHERE "hand"."id" = $1`, handID)
	if err != nil {
		return nil, err
	}

	hnd.Cards = crds

	return &hnd, nil
}

// GenerateDecks iterates over some hands and adds random cards to them
func GenerateDecks(hands []string) error {
	crds, err := GetAllCards()
	if err != nil {
		return err
	}

	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(*crds), func(i, j int) { (*crds)[i], (*crds)[j] = (*crds)[j], (*crds)[i] })

	chunkedCards := chunkCards(*crds, len(hands))

	for idx, handID := range hands {
		for _, card := range chunkedCards[idx] {
			err = AddCardToHand(card.ID, handID)
			if err != nil {
				break
			}
		}
	}

	return nil
}
