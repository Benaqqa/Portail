Write-Host "🔧 Fixing Database Schema for External Authentication..." -ForegroundColor Green
Write-Host ""

# Define the SQL commands
$sqlCommands = @(
    "UPDATE extern_auth_codes SET expiration_hours = 24 WHERE expiration_hours IS NULL;",
    "UPDATE extern_auth_codes SET one_time_only = true WHERE one_time_only IS NULL;",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS prenom VARCHAR(255);",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS nom VARCHAR(255);"
)

Write-Host "Running database migration commands..." -ForegroundColor Yellow

foreach ($sql in $sqlCommands) {
    Write-Host "Executing: $sql" -ForegroundColor Cyan
    try {
        psql -h localhost -U postgres -d cosone_db -c $sql
        Write-Host "✅ Command executed successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error executing command: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "🎉 Database migration completed!" -ForegroundColor Green
Write-Host "You can now restart your Spring Boot application." -ForegroundColor Yellow
Write-Host ""
Write-Host "To restart the application, run:" -ForegroundColor White
Write-Host "cd COSONE" -ForegroundColor Gray
Write-Host "mvn spring-boot:run" -ForegroundColor Gray

