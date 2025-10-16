@echo off
echo Fixing database schema for external authentication...
echo.

echo Running database migration...
psql -h localhost -U postgres -d cosone_db -c "UPDATE extern_auth_codes SET expiration_hours = 24 WHERE expiration_hours IS NULL;"

psql -h localhost -U postgres -d cosone_db -c "UPDATE extern_auth_codes SET one_time_only = true WHERE one_time_only IS NULL;"

psql -h localhost -U postgres -d cosone_db -c "ALTER TABLE users ADD COLUMN IF NOT EXISTS prenom VARCHAR(255);"

psql -h localhost -U postgres -d cosone_db -c "ALTER TABLE users ADD COLUMN IF NOT EXISTS nom VARCHAR(255);"

echo.
echo Database migration completed!
echo You can now restart your Spring Boot application.
pause

