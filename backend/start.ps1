$env:PORT="8080"
$env:JWT_SECRET="change-me-in-production"
$env:SQLITE_DSN="file:portal.db?_busy_timeout=5000"
$env:CORS_ALLOWED_ORIGINS="http://localhost:5173"

Write-Host "Starting backend server on :8080..." -ForegroundColor Green
go run ./cmd/server
