package types

// User represents a user/COMBATANT
type User struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Password string `json:"password"`
}

// Card represents the basic TT card structure
type Card struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	Type         string `json:"type"`
	Strength     int    `json:"strength"`
	Skill        int    `json:"skill"`
	MagicalForce int    `db:"magical_force" json:"magical_force"`
	Weapons      int    `json:"weapons"`
	Power        int    `json:"power"`
}

// Battle represents a battle of TT
type Battle struct {
	ID        string     `json:"id"`
	StartedAt NullTime   `db:"started_at" json:"started_at,omitempty"`
	Winner    NullString `json:"winner,omitempty"`
	Decks     []Deck     `json:"decks,omitempty"`
	Rounds    []Round    `json:"rounds,omitempty"`
}

// Deck represents a users selection of cards during a battle
type Deck struct {
	ID       string `json:"id"`
	Name     string `json:"name,omitempty"`
	UserID   string `db:"user_id" json:"user_id,omitempty"`
	BattleID string `db:"battle_id" json:"battle_id,omitempty"`
	Cards    []Card `json:"cards,omitempty"`
}

// CardInDeck is a join table linking card IDs and deck IDs
type CardInDeck struct {
	CardID string `db:"card_id" json:"card_id"`
	DeckID string `db:"deck_id" json:"deck_id"`
}

// Round represents the outcome of one turn for a battle
type Round struct {
	ID          string     `json:"id"`
	BattleID    string     `db:"battle_id" json:"battle_id"`
	Attribute   NullString `json:"attribute"`
	Leader      NullString `json:"leader,omitempty"`
	StartedAt   NullTime   `db:"started_at" json:"started_at"`
	WinningHand Hand       `json:"winning_hand,omitempty"`
	IsDraw      bool
}

// Hand represents one turn played by a user
type Hand struct {
	ID      string `json:"id"`
	DeckID  string `db:"deck_id" json:"deck_id"`
	RoundID string `db:"round_id" json:"round_id"`
	CardID  string `db:"card_id" json:"card_id"`
	Value   int    `json:"value"`
	Name    string `json:"name,omitempty"`
	UserID  string `db:"user_id" json:"user_id,omitempty"`
}
