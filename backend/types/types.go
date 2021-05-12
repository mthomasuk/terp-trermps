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

// Round represents a round of TT
type Round struct {
	ID        string     `json:"id"`
	StartedAt NullTime   `db:"started_at" json:"started_at,omitempty"`
	Winner    NullString `json:"winner,omitempty"`
	Hands     []Hand     `json:"hands,omitempty"`
}

// Hand represents a users selection of cards during a round
type Hand struct {
	ID      string `json:"id"`
	Name    string `json:"name,omitempty"`
	UserID  string `db:"user_id" json:"user_id,omitempty"`
	RoundID string `db:"round_id" json:"round_id,omitempty"`
	Cards   []Card `json:"cards,omitempty"`
}

// CardInHand is a join table linking card IDs and hand IDs
type CardInHand struct {
	CardID string `db:"card_id" json:"card_id"`
	HandID string `db:"hand_id" json:"hand_id"`
}
