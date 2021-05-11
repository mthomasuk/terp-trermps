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

  CREATE TABLE IF NOT EXISTS "round" (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v1(),
    started_at    TIMESTAMPTZ,
    winner        UUID,
    FOREIGN KEY (winner)
      REFERENCES "user" (id)
      ON DELETE NO ACTION
  );

  CREATE TABLE IF NOT EXISTS "hand" (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v1(),
    user_id       UUID,
    round_id      UUID,
    FOREIGN KEY (user_id)
      REFERENCES "user" (id)
      ON DELETE CASCADE,
    FOREIGN KEY (round_id)
      REFERENCES "round" (id)
      ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS "card_in_hand" (
    card_id       UUID,
    hand_id       UUID,
    FOREIGN KEY (card_id)
      REFERENCES "card" (id)
      ON DELETE CASCADE,
    FOREIGN KEY (hand_id)
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
