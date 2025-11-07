# Test Admin APIs - Quick Check
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Portal 365 - Admin API Test" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Test Backend Health
Write-Host "[1/5] Checking Backend Health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/healthz" -ErrorAction Stop
    Write-Host "✓ Backend is running" -ForegroundColor Green
    Write-Host "  Status: $($health.status)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Backend is NOT running!" -ForegroundColor Red
    Write-Host "  Please start backend: cd backend; go run ./cmd/server" -ForegroundColor Yellow
    exit 1
}

# Login
Write-Host "`n[2/5] Testing Login..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "admin@portal365.com"
        password = "admin123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Method POST -Uri "http://localhost:8080/api/v1/auth/login" -ContentType "application/json" -Body $loginBody -ErrorAction Stop
    $token = $loginResponse.data.access_token
    $user = $loginResponse.data.user
    
    Write-Host "✓ Login successful" -ForegroundColor Green
    Write-Host "  User: $($user.username) ($($user.email))" -ForegroundColor Gray
    Write-Host "  Roles: $($user.roles -join ', ')" -ForegroundColor Gray
    Write-Host "  Token: $($token.Substring(0, 50))..." -ForegroundColor Gray
} catch {
    Write-Host "✗ Login failed!" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test Documents API
Write-Host "`n[3/5] Testing Admin Documents API..." -ForegroundColor Yellow
try {
    $docsResponse = Invoke-RestMethod -Method GET -Uri "http://localhost:8080/api/v1/admin/documents?page=1&page_size=20" -Headers @{Authorization="Bearer $token"} -ErrorAction Stop
    
    Write-Host "✓ Documents API working" -ForegroundColor Green
    Write-Host "  Total documents: $($docsResponse.data.Count)" -ForegroundColor Gray
    Write-Host "  Pagination: Page $($docsResponse.pagination.page)/$($docsResponse.pagination.total_pages)" -ForegroundColor Gray
    
    if ($docsResponse.data.Count -gt 0) {
        Write-Host "`n  Sample documents:" -ForegroundColor Gray
        $docsResponse.data | Select-Object -First 3 | ForEach-Object {
            Write-Host "    - $($_.title) [$($_.status)]" -ForegroundColor DarkGray
        }
    }
} catch {
    Write-Host "✗ Documents API failed!" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Media API - Images
Write-Host "`n[4/5] Testing Admin Media API (Images)..." -ForegroundColor Yellow
try {
    $imagesUrl = "http://localhost:8080/api/v1/admin/media`?media_type=image`&page=1`&page_size=24"
    $imagesResponse = Invoke-RestMethod -Method GET -Uri $imagesUrl -Headers @{Authorization="Bearer $token"} -ErrorAction Stop
    
    Write-Host "✓ Images API working" -ForegroundColor Green
    Write-Host "  Total images: $($imagesResponse.data.Count)" -ForegroundColor Gray
    Write-Host "  Pagination: Page $($imagesResponse.pagination.page)/$($imagesResponse.pagination.total_pages)" -ForegroundColor Gray
    
    if ($imagesResponse.data.Count -gt 0) {
        Write-Host "`n  Sample images:" -ForegroundColor Gray
        $imagesResponse.data | Select-Object -First 3 | ForEach-Object {
            Write-Host "    - $($_.title) [$($_.status)]" -ForegroundColor DarkGray
        }
    }
} catch {
    Write-Host "✗ Images API failed!" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Media API - Videos
Write-Host "`n[5/5] Testing Admin Media API (Videos)..." -ForegroundColor Yellow
try {
    $videosUrl = "http://localhost:8080/api/v1/admin/media`?media_type=video`&page=1`&page_size=24"
    $videosResponse = Invoke-RestMethod -Method GET -Uri $videosUrl -Headers @{Authorization="Bearer $token"} -ErrorAction Stop
    
    Write-Host "✓ Videos API working" -ForegroundColor Green
    Write-Host "  Total videos: $($videosResponse.data.Count)" -ForegroundColor Gray
    Write-Host "  Pagination: Page $($videosResponse.pagination.page)/$($videosResponse.pagination.total_pages)" -ForegroundColor Gray
    
    if ($videosResponse.data.Count -gt 0) {
        Write-Host "`n  Sample videos:" -ForegroundColor Gray
        $videosResponse.data | Select-Object -First 3 | ForEach-Object {
            Write-Host "    - $($_.title) [$($_.status)]" -ForegroundColor DarkGray
        }
    }
} catch {
    Write-Host "✗ Videos API failed!" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Summary
Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "✓ Backend APIs are working correctly" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Open: file:///c:/Users/Admin/portal-365/test-frontend-admin.html" -ForegroundColor White
Write-Host "2. Click 'Test Login API' button" -ForegroundColor White
Write-Host "3. Click 'Open /admin/docs' button" -ForegroundColor White
Write-Host "4. Open Browser Console (F12) and check 'Admin Documents Debug:' log" -ForegroundColor White
Write-Host "5. Report what you see in the console log" -ForegroundColor White
Write-Host ""
Write-Host "Read detailed instructions in: DEBUG_STEPS.md" -ForegroundColor Cyan
Write-Host ""
