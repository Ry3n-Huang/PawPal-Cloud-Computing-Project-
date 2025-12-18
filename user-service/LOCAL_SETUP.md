# Local Setup Guide

## Prerequisites

1. MySQL installed (via Homebrew)
2. Node.js installed
3. Project code cloned

## Quick Setup Steps

### Step 1: Start MySQL

```bash
brew services start mysql
```

### Step 2: Setup Database

**If you know MySQL root password:**

```bash
cd /Users/xuanming/Project/4153_NEW_NEW
mysql -u root -p < database/schema.sql
mysql -u root -p pawpal_db < database/sample_data.sql
```

**If you don't know password or want to reset to empty password:**

```bash
# Stop MySQL
brew services stop mysql

# Start in safe mode (skip permission check)
mysqld_safe --skip-grant-tables &

# Connect to MySQL (no password needed)
mysql -u root

# In MySQL execute:
ALTER USER 'root'@'localhost' IDENTIFIED BY '';
FLUSH PRIVILEGES;
EXIT;

# Stop safe mode
killall mysqld_safe
killall mysqld

# Start MySQL normally
brew services start mysql

# Now can connect without password
mysql -u root < database/schema.sql
mysql -u root pawpal_db < database/sample_data.sql
```

**Or use interactive script:**

```bash
cd /Users/xuanming/Project/4153_NEW_NEW/user-service
./setup-local-db.sh
# Script will prompt for password
```

### Step 3: Configure Environment Variables

Edit `user-service/.env` file:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your password (leave empty if no password)
DB_NAME=pawpal_db
SKIP_DB=false
```

### Step 4: Verify Database

```bash
mysql -u root -p pawpal_db -e "SHOW TABLES;"
mysql -u root -p pawpal_db -e "SELECT COUNT(*) FROM users;"
mysql -u root -p pawpal_db -e "SELECT COUNT(*) FROM dogs;"
```

### Step 5: Test Database Connection

```bash
cd /Users/xuanming/Project/4153_NEW_NEW/user-service
node -e "
require('dotenv').config();
const { connectDatabase } = require('./src/config/database');
connectDatabase().then(() => {
  console.log('✅ Database connection successful!');
  process.exit(0);
}).catch(err => {
  console.error('❌ Database connection failed:', err.message);
  process.exit(1);
});
"
```

### Step 6: Start Service

```bash
cd /Users/xuanming/Project/4153_NEW_NEW/user-service
npm start
```

Should see:
```
📊 Database connection established
✅ Database test query successful: { test: 1 }
✅ Database connected successfully
🚀 PawPal User Service running on port 3001
```

### Step 7: Test API

```bash
# Health check
curl http://localhost:3001/health

# Get user list (from database)
curl http://localhost:3001/api/users

# Create user (write to database)
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","role":"owner"}' \
  http://localhost:3001/api/users

# Verify data in database
mysql -u root -p pawpal_db -e "SELECT * FROM users WHERE email='test@example.com';"
```

## Troubleshooting

### MySQL Connection Failed

1. Check if MySQL is running:
   ```bash
   brew services list | grep mysql
   ```

2. Check port:
   ```bash
   lsof -i :3306
   ```

3. Test connection:
   ```bash
   mysql -u root -p -e "SELECT 1;"
   ```

### Database Does Not Exist

```bash
mysql -u root -p < database/schema.sql
```

### Permission Issues

Ensure password in .env file is correct, or reset MySQL root password.
