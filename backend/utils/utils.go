package utils

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/go-playground/validator/v10"
)

var Validate = validator.New()

const (
	INFO    = "INFO"
	WARNING = "WARNING"
	ERROR   = "ERROR"
)

func ParseJSON(r *http.Request, payload any) error {
	if r.Body == nil {
		return fmt.Errorf("missing request body")
	}
	return json.NewDecoder(r.Body).Decode(payload)
}

func WriteJSON(w http.ResponseWriter, status int, v any) error {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(v)
}

func WriteError(w http.ResponseWriter, status int, err error) {
	WriteJSON(w, status, map[string]string{"error": err.Error()})
}

func GetTokenFromRequest(r *http.Request) string {
	tokenAuth := r.Header.Get("Authorization")
	tokenQuery := r.URL.Query().Get("token")

	// If token is in the Authorization header, it should start with "Bearer "
	if tokenAuth != "" {
		// Strip "Bearer " from the token
		if len(tokenAuth) > 7 && tokenAuth[:7] == "Bearer " {
			return tokenAuth[7:]
		}
	}

	if tokenQuery != "" {
		return tokenQuery
	}

	return ""
}

func LogMessage(level string, message ...any) {
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)
	log.Printf("[%s] %s", level, message)
}
