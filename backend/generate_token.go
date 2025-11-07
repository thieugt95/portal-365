package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	_ "modernc.org/sqlite"
)

func main() {
	db, err := sql.Open("sqlite", "file:portal.db?_pragma=busy_timeout(5000)&_pragma=journal_mode(WAL)")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	email := "admin@portal365.com"
	password := "admin123"

	// Verify user
	var userID int64
	var name, hashedPassword string
	err = db.QueryRowContext(context.Background(),
		"SELECT id, full_name, password_hash FROM users WHERE email = ?", email).
		Scan(&userID, &name, &hashedPassword)
	if err != nil {
		log.Fatal("User not found:", err)
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password)); err != nil {
		log.Fatal("Invalid password")
	}

	// Get user roles
	rows, err := db.QueryContext(context.Background(),
		`SELECT r.name FROM roles r 
		 INNER JOIN user_roles ur ON r.id = ur.role_id 
		 WHERE ur.user_id = ?`, userID)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	var roles []string
	for rows.Next() {
		var role string
		rows.Scan(&role)
		roles = append(roles, role)
	}

	// Generate JWT token
	jwtSecret := "change-me-in-production" // Must match backend config
	now := time.Now()

	claims := jwt.MapClaims{
		"sub":   userID,
		"email": email,
		"name":  name,
		"roles": roles,
		"iat":   now.Unix(),
		"exp":   now.Add(24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("=== Login Token ===")
	fmt.Printf("User: %s (%s)\n", name, email)
	fmt.Printf("Roles: %v\n", roles)
	fmt.Printf("\nAccess Token:\n%s\n", tokenString)
	fmt.Println("\n=== Usage ===")
	fmt.Println("Copy the token above and paste it into browser console:")
	fmt.Println("localStorage.setItem('accessToken', '<token>');")
	fmt.Println("\nOr use in curl:")
	fmt.Printf("curl -H \"Authorization: Bearer %s\" http://localhost:8080/api/v1/admin/documents\n", tokenString)
}
