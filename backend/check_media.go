package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "modernc.org/sqlite"
)

func main() {
	db, err := sql.Open("sqlite", "file:portal.db?_busy_timeout=5000")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Count total
	var count int
	err = db.QueryRow("SELECT COUNT(*) FROM media_items").Scan(&count)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Total media items: %d\n\n", count)

	// List all
	rows, err := db.Query(`SELECT id, title, media_type, status, category_id, uploaded_by 
		FROM media_items ORDER BY id`)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	fmt.Println("ID | Title | Type | Status | CategoryID | UploadedBy")
	fmt.Println("-----------------------------------------------------------")
	for rows.Next() {
		var id, categoryID, uploadedBy int
		var title, mediaType, status string
		err = rows.Scan(&id, &title, &mediaType, &status, &categoryID, &uploadedBy)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Printf("%d | %s | %s | %s | %d | %d\n", id, title, mediaType, status, categoryID, uploadedBy)
	}

	// Count by media_type
	fmt.Println("\n--- Count by media_type ---")
	rows2, _ := db.Query("SELECT media_type, COUNT(*) FROM media_items GROUP BY media_type")
	defer rows2.Close()
	for rows2.Next() {
		var mediaType string
		var count int
		rows2.Scan(&mediaType, &count)
		fmt.Printf("%s: %d\n", mediaType, count)
	}
}
