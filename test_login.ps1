# Test login and get token
$body = @{
    email = "admin@portal365.com"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/login" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"

Write-Host "=== Login Successful ===" -ForegroundColor Green
Write-Host "Access Token:"
Write-Host $response.data.access_token
Write-Host ""
Write-Host "=== Test Admin Endpoints ===" -ForegroundColor Yellow

# Test documents endpoint
try {
    $docs = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/admin/documents" `
        -Headers @{"Authorization" = "Bearer $($response.data.access_token)"}
    Write-Host "✓ Documents endpoint works!" -ForegroundColor Green
    Write-Host "  Found $($docs.data.Count) documents"
} catch {
    Write-Host "✗ Documents endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test media endpoint
try {
    $media = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/admin/media?media_type=image" `
        -Headers @{"Authorization" = "Bearer $($response.data.access_token)"}
    Write-Host "✓ Media endpoint works!" -ForegroundColor Green
    Write-Host "  Found $($media.data.Count) media items"
} catch {
    Write-Host "✗ Media endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== For Browser Testing ===" -ForegroundColor Cyan
Write-Host "localStorage.setItem('accessToken', '$($response.data.access_token)');"
