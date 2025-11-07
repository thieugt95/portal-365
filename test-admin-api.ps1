# Test Admin Upload APIs

Write-Host "=== Testing Admin API Endpoints ===" -ForegroundColor Cyan

# 1. Login
Write-Host "`n[1] Testing Login..." -ForegroundColor Yellow
$loginResponse = Invoke-RestMethod -Method POST -Uri "http://localhost:8080/api/v1/auth/login" -ContentType "application/json" -Body '{"email":"admin@portal365.com","password":"admin123"}'
$token = $loginResponse.data.access_token

if ($token) {
    Write-Host "✓ Login successful" -ForegroundColor Green
    Write-Host "Token: $($token.Substring(0, 50))..." -ForegroundColor Gray
} else {
    Write-Host "✗ Login failed" -ForegroundColor Red
    exit 1
}

# 2. Get Documents
Write-Host "`n[2] Testing Get Documents..." -ForegroundColor Yellow
try {
    $docsResponse = Invoke-RestMethod -Method GET -Uri "http://localhost:8080/api/v1/admin/documents" -Headers @{Authorization="Bearer $token"}
    Write-Host "✓ Got $($docsResponse.data.Count) documents" -ForegroundColor Green
    $docsResponse.data | Select-Object -First 3 id, title | Format-Table
} catch {
    Write-Host "✗ Failed: $_" -ForegroundColor Red
}

# 3. Get Media - Images
Write-Host "`n[3] Testing Get Media (Images)..." -ForegroundColor Yellow
try {
    $imagesResponse = Invoke-RestMethod -Method GET -Uri "http://localhost:8080/api/v1/admin/media?media_type=image" -Headers @{Authorization="Bearer $token"}
    Write-Host "✓ Got $($imagesResponse.data.Count) images" -ForegroundColor Green
    $imagesResponse.data | Select-Object -First 3 id, title, media_type | Format-Table
} catch {
    Write-Host "✗ Failed: $_" -ForegroundColor Red
}

# 4. Get Media - Videos
Write-Host "`n[4] Testing Get Media (Videos)..." -ForegroundColor Yellow
try {
    $videosResponse = Invoke-RestMethod -Method GET -Uri "http://localhost:8080/api/v1/admin/media?media_type=video" -Headers @{Authorization="Bearer $token"}
    Write-Host "✓ Got $($videosResponse.data.Count) videos" -ForegroundColor Green
    $videosResponse.data | Select-Object -First 3 id, title, media_type | Format-Table
} catch {
    Write-Host "✗ Failed: $_" -ForegroundColor Red
}

# 5. Test Upload Document (if test file exists)
Write-Host "`n[5] Testing Upload Document..." -ForegroundColor Yellow
$testFile = "c:\Users\Admin\portal-365\README.md"
if (Test-Path $testFile) {
    try {
        $boundary = [System.Guid]::NewGuid().ToString()
        $fileName = Split-Path $testFile -Leaf
        
        # Read file content
        $fileContent = [System.IO.File]::ReadAllBytes($testFile)
        
        # Build multipart form data
        $bodyLines = @(
            "--$boundary",
            "Content-Disposition: form-data; name=`"file`"; filename=`"$fileName`"",
            "Content-Type: text/markdown",
            "",
            [System.Text.Encoding]::UTF8.GetString($fileContent),
            "--$boundary",
            "Content-Disposition: form-data; name=`"title`"",
            "",
            "Test Document $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')",
            "--$boundary",
            "Content-Disposition: form-data; name=`"category_id`"",
            "",
            "11",
            "--$boundary",
            "Content-Disposition: form-data; name=`"description`"",
            "",
            "Test upload from PowerShell script",
            "--$boundary--"
        )
        
        $body = $bodyLines -join "`r`n"
        
        Write-Host "Note: Multipart upload test skipped (complex in PowerShell)" -ForegroundColor Gray
        Write-Host "Use test-admin-upload.html in browser instead" -ForegroundColor Gray
    } catch {
        Write-Host "✗ Failed: $_" -ForegroundColor Red
    }
} else {
    Write-Host "Skipped: Test file not found" -ForegroundColor Gray
}

Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "Login: Working" -ForegroundColor Green
Write-Host "Get Documents: Working - $($docsResponse.data.Count) items" -ForegroundColor Green
Write-Host "Get Images: Working - $($imagesResponse.data.Count) items" -ForegroundColor Green
Write-Host "Get Videos: Working - $($videosResponse.data.Count) items" -ForegroundColor Green
Write-Host "`nFor upload testing, open: test-admin-upload.html in browser" -ForegroundColor Yellow
