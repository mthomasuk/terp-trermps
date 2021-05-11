package helpers

import (
	"math/rand"
	"time"
)

// GetRandomLetter generates a random uppercase letter
func GetRandomLetter() string {
	rand.Seed(time.Now().Unix())

	randomChar := 'A' + rune(rand.Intn(26))

	return string(randomChar)
}
