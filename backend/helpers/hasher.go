package helpers

import (
	"encoding/hex"

	"golang.org/x/crypto/scrypt"
)

var salt = []byte("fartypants")

// GenerateHash generates a pseudo secure hex string given a plain string
func GenerateHash(password string) (string, error) {
	hash, err := scrypt.Key([]byte(password), salt, 32768, 8, 1, 32)
	if err != nil {
		return "", err
	}

	return hex.EncodeToString(hash), nil
}

// ValidatePassword compares a hashed password against a plain string
func ValidatePassword(password string, hash string) bool {
	newHash, err := GenerateHash(password)
	if err != nil {
		return false
	}

	return newHash == hash
}
