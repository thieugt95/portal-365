package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"

	"github.com/thieugt95/portal-365/backend/internal/database"
	"github.com/thieugt95/portal-365/backend/internal/models"
	_ "modernc.org/sqlite"
)

func main() {
	// Initialize database
	db, err := sql.Open("sqlite", "file:portal.db?_pragma=busy_timeout(5000)&_pragma=journal_mode(WAL)")
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	repos := database.NewRepositories(db)
	ctx := context.Background()

	fmt.Println("=== Seeding Documents and Media ===\n")

	// Seed Documents
	fmt.Println("Creating sample documents...")
	documents := []models.Document{
		{
			Title:       "Quyết định số 01/2025",
			Slug:        "quyet-dinh-01-2025",
			Description: "Quyết định về việc phân công nhiệm vụ",
			CategoryID:  11, // Kho văn bản
			FileURL:     "/static/uploads/documents/2025/11/sample-doc1.pdf",
			FileName:    "quyet-dinh-01-2025.pdf",
			FileSize:    1024000,
			FileType:    "application/pdf",
			DocumentNo:  "01/QĐ-PKQP",
			UploadedBy:  1,
			Status:      "published",
		},
		{
			Title:       "Thông báo số 05/2025",
			Slug:        "thong-bao-05-2025",
			Description: "Thông báo về lịch công tác tháng 11",
			CategoryID:  11,
			FileURL:     "/static/uploads/documents/2025/11/sample-doc2.pdf",
			FileName:    "thong-bao-05-2025.pdf",
			FileSize:    512000,
			FileType:    "application/pdf",
			DocumentNo:  "05/TB-PKQP",
			UploadedBy:  1,
			Status:      "published",
		},
		{
			Title:       "Báo cáo tháng 10/2025",
			Slug:        "bao-cao-thang-10-2025",
			Description: "Báo cáo tổng kết hoạt động tháng 10",
			CategoryID:  11,
			FileURL:     "/static/uploads/documents/2025/11/sample-doc3.docx",
			FileName:    "bao-cao-thang-10-2025.docx",
			FileSize:    2048000,
			FileType:    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			UploadedBy:  1,
			Status:      "published",
		},
	}

	for i, doc := range documents {
		if err := repos.Documents.Create(ctx, &doc); err != nil {
			log.Printf("Failed to create document %d: %v\n", i+1, err)
		} else {
			fmt.Printf("✓ Created document: %s (ID: %d)\n", doc.Title, doc.ID)
		}
	}

	// Seed Media Items
	fmt.Println("\nCreating sample media items...")
	mediaItems := []models.MediaItem{
		{
			Title:        "Diễn tập quân sự 2025",
			Slug:         "dien-tap-quan-su-2025",
			Description:  "Video diễn tập quân sự năm 2025",
			URL:          "/static/uploads/media/2025/11/video-dien-tap.mp4",
			ThumbnailURL: "/static/uploads/media/2025/11/thumb-dien-tap.jpg",
			MediaType:    "video",
			FileSize:     52428800, // 50MB
			CategoryID:   6,        // Hoạt động Sư đoàn
			UploadedBy:   1,
			Status:       "published",
		},
		{
			Title:       "Lễ kỷ niệm thành lập",
			Slug:        "le-ky-niem-thanh-lap",
			Description: "Hình ảnh lễ kỷ niệm ngày thành lập đơn vị",
			URL:         "/static/uploads/media/2025/11/le-ky-niem-1.jpg",
			MediaType:   "image",
			FileSize:    2048000, // 2MB
			Width:       1920,
			Height:      1080,
			CategoryID:  6,
			UploadedBy:  1,
			Status:      "published",
		},
		{
			Title:       "Huấn luyện chiến đấu",
			Slug:        "huan-luyen-chien-dau",
			Description: "Hình ảnh huấn luyện chiến đấu",
			URL:         "/static/uploads/media/2025/11/huan-luyen-1.jpg",
			MediaType:   "image",
			FileSize:    1536000, // 1.5MB
			Width:       1920,
			Height:      1080,
			CategoryID:  6,
			UploadedBy:  1,
			Status:      "published",
		},
		{
			Title:        "Tập trận kết hợp binh chủng",
			Slug:         "tap-tran-ket-hop-binh-chung",
			Description:  "Video tập trận kết hợp nhiều binh chủng",
			URL:          "/static/uploads/media/2025/11/video-tap-tran.mp4",
			ThumbnailURL: "/static/uploads/media/2025/11/thumb-tap-tran.jpg",
			MediaType:    "video",
			FileSize:     78643200, // 75MB
			CategoryID:   6,
			UploadedBy:   1,
			Status:       "published",
		},
		{
			Title:       "Lễ xuất quân",
			Slug:        "le-xuat-quan",
			Description: "Hình ảnh lễ xuất quân làm nhiệm vụ",
			URL:         "/static/uploads/media/2025/11/xuat-quan-1.jpg",
			MediaType:   "image",
			FileSize:    1843200, // 1.8MB
			Width:       1920,
			Height:      1280,
			CategoryID:  6,
			UploadedBy:  1,
			Status:      "published",
		},
	}

	for i, media := range mediaItems {
		if err := repos.MediaItems.Create(ctx, &media); err != nil {
			log.Printf("Failed to create media %d: %v\n", i+1, err)
		} else {
			fmt.Printf("✓ Created %s: %s (ID: %d)\n", media.MediaType, media.Title, media.ID)
		}
	}

	// Summary
	fmt.Println("\n=== Seed Summary ===")

	var docCount, mediaCount int
	db.QueryRow("SELECT COUNT(*) FROM documents").Scan(&docCount)
	db.QueryRow("SELECT COUNT(*) FROM media_items").Scan(&mediaCount)

	fmt.Printf("Total documents: %d\n", docCount)
	fmt.Printf("Total media items: %d\n", mediaCount)

	var imageCount, videoCount int
	db.QueryRow("SELECT COUNT(*) FROM media_items WHERE media_type = 'image'").Scan(&imageCount)
	db.QueryRow("SELECT COUNT(*) FROM media_items WHERE media_type = 'video'").Scan(&videoCount)

	fmt.Printf("  - Images: %d\n", imageCount)
	fmt.Printf("  - Videos: %d\n", videoCount)

	fmt.Println("\n✅ Seed completed successfully!")
}
