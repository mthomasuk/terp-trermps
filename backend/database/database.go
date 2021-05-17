package database

import (
	"fmt"
	"log"
	"os"

	"github.com/jmoiron/sqlx"
	// need to import pq for postgres
	_ "github.com/lib/pq"
)

const noSQLResults = "sql: no rows in result set"

var schema = `
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  CREATE TABLE IF NOT EXISTS "user" (
    id       UUID PRIMARY KEY DEFAULT uuid_generate_v1(),
    name     TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );

  CREATE INDEX ON "user" (name);

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

  CREATE INDEX ON "deck" (battle_id);

  CREATE TABLE IF NOT EXISTS "card_in_deck" (
    card_id       UUID,
    deck_id       UUID,
    added_at      TIMESTAMPZ DEFAULT now(),
    FOREIGN KEY (card_id)
      REFERENCES "card" (id)
      ON DELETE CASCADE,
    FOREIGN KEY (deck_id)
      REFERENCES "deck" (id)
      ON DELETE CASCADE
  );

  CREATE INDEX ON "card_in_deck" (deck_id);

  CREATE TABLE IF NOT EXISTS "round" (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v1(),
    battle_id     UUID,
    attribute     VARCHAR,
    leader        UUID,
    started_at    TIMESTAMPZ DEFAULT now(),
    FOREIGN KEY (battle_id)
      REFERENCES "battle" (id)
      ON DELETE CASCADE,
    FOREIGN KEY (leader)
      REFERENCES "user" (id)
      ON DELETE CASCADE
  );

  CREATE INDEX ON "round" (started_at);

  CREATE TABLE IF NOT EXISTS "hand" (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v1(),
    deck_id       UUID,
    card_id       UUID,
    round_id      UUID,
    value         INTEGER NOT NULL,
    FOREIGN KEY (deck_id)
      REFERENCES "deck" (id)
      ON DELETE CASCADE,
    FOREIGN KEY (round_id)
      REFERENCES "round" (id)
      ON DELETE CASCADE,
    FOREIGN KEY (card_id)
      REFERENCES "card" (id)
      ON DELETE CASCADE
  );

  CREATE INDEX ON "hand" (round_id);
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
