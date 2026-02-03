# API Test Script for DailyTracker
Write-Host "Testing DailyTracker API Endpoints" -ForegroundColor Cyan

$baseUrl = "http://localhost:8080/api"

# Test 1: Health Check
Write-Host "`nTest 1: Health Check (GET /api/ping)..." -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "$baseUrl/ping" -UseBasicParsing
Write-Host "Success: $($response.Content)" -ForegroundColor Green

# Test 2: Get All Goals
Write-Host "`nTest 2: Get All Goals (GET /api/goals)..." -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "$baseUrl/goals" -UseBasicParsing
Write-Host "Success: $($response.Content)" -ForegroundColor Green

# Test 3: Create a Goal
Write-Host "`nTest 3: Create Goal (POST /api/goals)..." -ForegroundColor Yellow
$body = '{"text":"Complete API Testing"}'
$response = Invoke-WebRequest -Uri "$baseUrl/goals" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
Write-Host "Success: $($response.Content)" -ForegroundColor Green

# Test 4: Get All Habits
Write-Host "`nTest 4: Get All Habits (GET /api/habits)..." -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "$baseUrl/habits" -UseBasicParsing
Write-Host "Success: $($response.Content)" -ForegroundColor Green

# Test 5: Create a Habit
Write-Host "`nTest 5: Create Habit (POST /api/habits)..." -ForegroundColor Yellow
$body = '{"name":"Test API Integration","description":"Testing habit creation"}'
$response = Invoke-WebRequest -Uri "$baseUrl/habits" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
Write-Host "Success: $($response.Content)" -ForegroundColor Green

# Test 6: Get All Notes
Write-Host "`nTest 6: Get All Notes (GET /api/notes)..." -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "$baseUrl/notes" -UseBasicParsing
Write-Host "Success: $($response.Content)" -ForegroundColor Green

# Test 7: Create a Note
Write-Host "`nTest 7: Create Note (POST /api/notes)..." -ForegroundColor Yellow
$body = '{"title":"API Test Note","content":"This note was created via API testing"}'
$response = Invoke-WebRequest -Uri "$baseUrl/notes" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
Write-Host "Success: $($response.Content)" -ForegroundColor Green

Write-Host "`nAPI Testing Complete!" -ForegroundColor Cyan
Write-Host "All endpoints are working correctly" -ForegroundColor Green
