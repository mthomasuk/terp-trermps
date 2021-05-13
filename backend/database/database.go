package database

import (
	"fmt"
	"log"
	"os"

	"github.com/jmoiron/sqlx"
	// need to import pq for postgres
	_ "github.com/lib/pq"
)

var schema = `
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  CREATE TABLE IF NOT EXISTS "user" (
    id       UUID PRIMARY KEY DEFAULT uuid_generate_v1(),
    name     TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "card" (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v1(),
    name          TEXT NOT NULL,
    type          TEXT NOT NULL,
    strength      INTEGER NOT NULL,
    skill         INTEGER NOT NULL,
    magical_force INTEGER NOT NULL,
    weapons       INTEGER NOT NULL,
    power         INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "battle" (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v1(),
    started_at    TIMESTAMPTZ,
    winner        UUID,
    FOREIGN KEY (winner)
      REFERENCES "user" (id)
      ON DELETE NO ACTION
  );

  CREATE TABLE IF NOT EXISTS "deck" (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v1(),
    user_id       UUID,
    battle_id     UUID,
    FOREIGN KEY (user_id)
      REFERENCES "user" (id)
      ON DELETE CASCADE,
    FOREIGN KEY (battle_id)
      REFERENCES "battle" (id)
      ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS "card_in_deck" (
    card_id       UUID,
    deck_id       UUID,
    FOREIGN KEY (card_id)
      REFERENCES "card" (id)
      ON DELETE CASCADE,
    FOREIGN KEY (deck_id)
      REFERENCES "deck" (id)
      ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS "hand" (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v1(),
    user_id       UUID,
    deck_id       UUID,
    card_id       UUID,
    attribute     VARCHAR NOT NULL,
    value         INTEGER NOT NULL,
    FOREIGN KEY (user_id)
      REFERENCES "user" (id)
      ON DELETE CASCADE,
    FOREIGN KEY (deck_id)
      REFERENCES "deck" (id)
      ON DELETE CASCADE,
    FOREIGN KEY (card_id)
      REFERENCES "card" (id)
      ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS "round" (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v1(),
    winning_hand  UUID,
    FOREIGN KEY (winning_hand)
      REFERENCES "hand" (id)
      ON DELETE CASCADE
  );
`

// Conn is an initialized DB connection
var Conn *sqlx.DB

// Run initialises DB and assign connection
func Run() {
	var err error

	user := os.Getenv("PG_USER")
	password := os.Getenv("PG_PASSWORD")
	dbname := os.Getenv("PG_DBNAME")

	if user == "" {
		user = "admin"
	}

	if password == "" {
		password = "password"
	}

	if dbname == "" {
		dbname = "terp-trermps"
	}

	Conn, err = sqlx.Connect(
		"postgres",
		fmt.Sprintf(
			"user=%s password=%s dbname=%s sslmode=disable",
			user,
			password,
			dbname,
		),
	)
	if err != nil {
		log.Fatalln(err)
	}

	Conn.SetMaxIdleConns(5)
	Conn.SetMaxOpenConns(10)

	Conn.MustExec(schema)
}
