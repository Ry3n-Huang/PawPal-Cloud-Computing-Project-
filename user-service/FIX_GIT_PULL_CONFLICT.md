# Fix Git Pull Conflict - GCP VM

## Issue
When executing `git pull` on GCP VM, encountered conflicts:
- `user-service/.env` has local modifications
- `user-service/node_modules/.package-lock.json` has local modifications

## Current Directory Structure
```
/opt/pawpal/Cloud-Computing-Database/  <- Git repository root
└── user-service/                      <- Current working directory
    ├── .env                          <- Conflicting file (relative to repository root)
    └── node_modules/
        └── .package-lock.json        <- Conflicting file
```

## Solution

### Method 1: Using Git Stash (Recommended)

```bash
# In user-service directory
cd /opt/pawpal/Cloud-Computing-Database/user-service

# Backup .env
cp .env .env.backup

# Go back to repository root
cd /opt/pawpal/Cloud-Computing-Database

# Save local changes
git stash push -m "Save local .env and node_modules changes" user-service/.env user-service/node_modules/.package-lock.json

# Pull latest code
git pull

# Restore .env file
cp user-service/.env.backup user-service/.env

# Restart service
cd user-service
pm2 restart user-service
```

### Method 2: Direct Reset (Simpler)

```bash
# In user-service directory
cd /opt/pawpal/Cloud-Computing-Database/user-service

# Backup .env
cp .env .env.backup

# Go back to repository root
cd /opt/pawpal/Cloud-Computing-Database

# Reset conflicting files (relative to repository root)
git checkout -- user-service/.env
git checkout -- user-service/node_modules/.package-lock.json

# Pull updates
git pull

# Restore .env
cp user-service/.env.backup user-service/.env

# Restart service
cd user-service
pm2 restart user-service
```

### Method 3: Force Overwrite (Fastest)

```bash
# In user-service directory
cd /opt/pawpal/Cloud-Computing-Database/user-service

# Backup .env
cp .env .env.backup

# Go back to repository root
cd /opt/pawpal/Cloud-Computing-Database

# Discard local changes and pull
git reset --hard HEAD
git pull

# Restore .env
cp user-service/.env.backup user-service/.env

# Restart service
cd user-service
pm2 restart user-service
```

## Recommended Steps (Method 2 - Simplest)

```bash
# 1. Backup .env (in user-service directory)
cd /opt/pawpal/Cloud-Computing-Database/user-service
cp .env .env.backup

# 2. Go back to repository root
cd /opt/pawpal/Cloud-Computing-Database

# 3. Reset conflicting files
git checkout -- user-service/.env
git checkout -- user-service/node_modules/.package-lock.json

# 4. Pull updates
git pull

# 5. Restore .env
cp user-service/.env.backup user-service/.env

# 6. Go back to user-service directory and restart service
cd user-service
pm2 restart user-service

# 7. Verify
pm2 status
curl http://localhost:3001/health
```

## Notes

⚠️ **Important**:
- `.env` file contains sensitive information like production database passwords
- **Do not** commit `.env` file to Git
- Ensure `.env` file is in `.gitignore`
- After pulling, must restore `.env` file, otherwise service may not be able to connect to database

## Verify Update

After update, verify Swagger documentation:

```bash
# Check if Swagger JSON contains PUT method
curl http://localhost:3001/api-docs/swagger.json | grep -A 5 '"put"'

# Or access Swagger UI
# http://34.9.57.25:3001/api-docs/
```
