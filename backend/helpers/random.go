package helpers

import (
	"crypto/rand"
	"math/big"
)

// GetRandomLetter generates a random uppercase letter
func GetRandomLetter() string {
	n, _ := rand.Int(rand.Reader, big.NewInt(26))

	return string('A' + rune(n.Int64()))
}
