# PowerShell script to run database migrations
# Make sure PostgreSQL is running and you have access to the cosone_db database

Write-Host "Running Database Migrations for COSONE..." -ForegroundColor Green

# Check if psql is available
try {
    $psqlVersion = psql --version
    Write-Host "✅ PostgreSQL client found: $psqlVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ PostgreSQL client not found. Please install PostgreSQL or add it to PATH." -ForegroundColor Red
    Write-Host "You can download PostgreSQL from: https://www.postgresql.org/download/" -ForegroundColor Yellow
    exit 1
}

Write-Host "`nStep 1: Running extern_auth_codes migration..." -ForegroundColor Cyan
try {
    # Run the extern_auth_codes migration
    psql -h localhost -U postgres -d cosone_db -f "extern_auth_codes_migration.sql"
    Write-Host "✅ extern_auth_codes migration completed!" -ForegroundColor Green
} catch {
    Write-Host "❌ extern_auth_codes migration failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please check your database connection and run the migration manually." -ForegroundColor Yellow
}

Write-Host "`nStep 2: Running users table migration..." -ForegroundColor Cyan
try {
    # Run the users table migration
    psql -h localhost -U postgres -d cosone_db -f "users_table_migration.sql"
    Write-Host "✅ users table migration completed!" -ForegroundColor Green
} catch {
    Write-Host "❌ users table migration failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please check your database connection and run the migration manually." -ForegroundColor Yellow
}

Write-Host "`nStep 3: Verifying migrations..." -ForegroundColor Cyan
try {
    # Check extern_auth_codes table structure
    $result1 = psql -h localhost -U postgres -d cosone_db -t -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'extern_auth_codes' AND column_name IN ('matricule', 'num_cin', 'phone_number', 'expiration_hours', 'one_time_only', 'expiration_date');"
    Write-Host "extern_auth_codes new columns: $result1" -ForegroundColor White
    
    # Check users table structure
    $result2 = psql -h localhost -U postgres -d cosone_db -t -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'users' AND column_name IN ('prenom', 'nom');"
    Write-Host "users table new columns: $result2" -ForegroundColor White
    
    Write-Host "✅ Database migrations verification completed!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Could not verify migrations: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n🎉 Database migrations completed!" -ForegroundColor Green
Write-Host "You can now restart your Spring Boot application and test external authentication." -ForegroundColor Cyan
