package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "modernc.org/sqlite"
)

func main() {
	db, err := sql.Open("sqlite", "file:portal.db?_pragma=busy_timeout(5000)&_pragma=journal_mode(WAL)")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Check documents
	var docCount int
	err = db.QueryRow("SELECT COUNT(*) FROM documents").Scan(&docCount)
	if err != nil {
		log.Printf("Error counting documents: %v\n", err)
	} else {
		fmt.Printf("\n=== DOCUMENTS ===\n")
		fmt.Printf("Total: %d\n\n", docCount)

		if docCount > 0 {
			rows, err := db.Query("SELECT id, title, file_type, file_size, status, created_at FROM documents LIMIT 5")
			if err != nil {
				log.Printf("Error fetching documents: %v\n", err)
			} else {
				defer rows.Close()
				fmt.Println("Recent documents:")
				for rows.Next() {
					var id int64
					var title, fileType, status, createdAt string
					var fileSize int64
					rows.Scan(&id, &title, &fileType, &fileSize, &status, &createdAt)
					fmt.Printf("  [%d] %s - %s (%d bytes) - %s\n", id, title, fileType, fileSize, status)
				}
			}
		}
	}

	// Check media_items
	var mediaCount int
	err = db.QueryRow("SELECT COUNT(*) FROM media_items").Scan(&mediaCount)
	if err != nil {
		log.Printf("Error counting media: %v\n", err)
	} else {
		fmt.Printf("\n=== MEDIA ITEMS ===\n")
		fmt.Printf("Total: %d\n\n", mediaCount)

		if mediaCount > 0 {
			rows, err := db.Query("SELECT id, title, media_type, file_size, status, created_at FROM media_items LIMIT 5")
			if err != nil {
				log.Printf("Error fetching media: %v\n", err)
			} else {
				defer rows.Close()
				fmt.Println("Recent media:")
				for rows.Next() {
					var id int64
					var title, mediaType, status, createdAt string
					var fileSize int64
					rows.Scan(&id, &title, &mediaType, &fileSize, &status, &createdAt)
					fmt.Printf("  [%d] %s - %s (%d bytes) - %s\n", id, title, mediaType, fileSize, status)
				}
			}
		}
	}
}
