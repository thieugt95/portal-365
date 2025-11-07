package main

import (
	"fmt"
	"log"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID int64    `json:"sub"`
	Roles  []string `json:"roles"`
	jwt.RegisteredClaims
}

func main() {
	tokenString := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHBvcnRhbDM2NS5jb20iLCJleHAiOjE3NjI2MDI0MTEsImlhdCI6MTc2MjUxNjAxMSwibmFtZSI6IkFkbWluIFVzZXIiLCJyb2xlcyI6WyJBZG1pbiJdLCJzdWIiOjF9.5ET7Mvxp1aOeL7qVH-eJqVf-V73WKugExH9gJdtGmXI"
	jwtSecret := "change-me-in-production"

	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(jwtSecret), nil
	})

	if err != nil {
		log.Printf("Parse error: %v", err)
	}

	if !token.Valid {
		log.Println("Token is not valid")
	}

	fmt.Printf("Token Valid: %v\n", token.Valid)
	fmt.Printf("Claims: %+v\n", claims)
	fmt.Printf("UserID: %d\n", claims.UserID)
	fmt.Printf("Roles: %v\n", claims.Roles)
}
