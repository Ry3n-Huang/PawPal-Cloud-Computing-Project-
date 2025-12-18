# Troubleshoot PM2 Service Error

## Issue
Service status cycles between `online` and `errored`, cannot start normally.

## Diagnostic Steps

### 1. View error logs

```bash
# View recent error logs
pm2 logs user-service --err --lines 50

# Or view all logs
pm2 logs user-service --lines 100
```

### 2. Possible causes and solutions

#### A. Code syntax errors
```bash
# Check code syntax
cd /opt/pawpal/Cloud-Computing-Database/user-service
node -c src/app.js
node -c src/routes/dogRoutes.js
node -c src/routes/swaggerRoutes.js
```

#### B. Database connection issues
```bash
# Check .env file configuration
cat .env | grep DB_

# Test database connection
mysql -h localhost -u user_service -p pawpal_user_db
# Enter password: huakaifugui
```

#### C. Dependency issues
```bash
# Reinstall dependencies
cd /opt/pawpal/Cloud-Computing-Database/user-service
npm install --production
```

#### D. Port occupied
```bash
# Check port usage
sudo netstat -tulpn | grep 3001
# Or
sudo lsof -i :3001
```

### 3. Stop and restart

```bash
# Stop service
pm2 stop user-service

# Delete service
pm2 delete user-service

# Restart
cd /opt/pawpal/Cloud-Computing-Database/user-service
pm2 start src/app.js --name user-service

# Save configuration
pm2 save
```

### 4. Use --update-env to update environment variables

```bash
pm2 restart user-service --update-env
```

## Quick Diagnostic Commands

```bash
# 1. View error logs
pm2 logs user-service --err --lines 50

# 2. Check code syntax
cd /opt/pawpal/Cloud-Computing-Database/user-service
node -c src/app.js

# 3. Check environment variables
cat .env | grep -E "DB_|PORT|NODE_ENV"

# 4. Test database connection
mysql -h localhost -u user_service -p pawpal_user_db
```
