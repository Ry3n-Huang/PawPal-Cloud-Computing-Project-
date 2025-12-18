# MySQL Installation Guide - Windows

## Method 1: Using MySQL Installer (Recommended)

### Step 1: Download MySQL Installer

1. Visit: https://dev.mysql.com/downloads/installer/
2. Select **MySQL Installer for Windows**
3. Download **mysql-installer-community** (recommended, free version)
   - File size approximately 400MB+
   - Select "No thanks, just start my download"

### Step 2: Install MySQL

1. Run the downloaded `.msi` installer
2. Select installation type:
   - **Developer Default** (recommended, includes MySQL Server + Workbench + other tools)
   - Or **Server only** (install MySQL Server only)

3. During installation:
   - Select **Standalone MySQL Server**
   - Configuration type select **Development Computer**
   - Set root password: **pawpal_secure_2024!** (consistent with password in .env file)
   - Add Windows service: **Yes**
   - Windows service name: **MySQL80** (default)

4. Complete installation

### Step 3: Verify Installation

Open PowerShell (as Administrator), run:

```powershell
# Check MySQL service
Get-Service MySQL80

# Start MySQL service (if not started)
Start-Service MySQL80

# Test connection
mysql -u root -p
# Enter password: pawpal_secure_2024!
```

---

## Method 2: Using XAMPP (Simpler, but includes Apache)

### Step 1: Download XAMPP

1. Visit: https://www.apachefriends.org/
2. Download **XAMPP for Windows**
3. Run installer

### Step 2: Start MySQL

1. Open **XAMPP Control Panel**
2. Click **Start** button next to **MySQL**
3. MySQL default configuration:
   - Port: 3306
   - Username: root
   - Password: (empty, needs to be set)

### Step 3: Set root Password

```powershell
# Go to XAMPP MySQL directory (usually C:\xampp\mysql\bin)
cd C:\xampp\mysql\bin

# Set root password
.\mysqladmin.exe -u root password "pawpal_secure_2024!"
```

---

## Method 3: Using Chocolatey (If Chocolatey is installed)

```powershell
# Run PowerShell as Administrator
choco install mysql -y

# Start MySQL service
Start-Service MySQL80
```

---

## Post-Installation Database Configuration

### 1. Create Database and Tables

```powershell
# Go to project root directory
cd "E:\ColumbiaU\2025 Fall\PawPal-Cloud-Computing-Project-"

# Run database schema
mysql -u root -p < database/schema.sql
# Enter password: pawpal_secure_2024!

# Run OAuth migration (add google_id column)
mysql -u root -p pawpal_db < database/migration_add_google_id.sql
```

### 2. Verify Database

```powershell
mysql -u root -p pawpal_db -e "SHOW TABLES;"
```

Should see `users` and `dogs` tables.

### 3. Start Service

```powershell
cd user-service
npm.cmd run dev
```

---

## Common Issues

### MySQL Service Cannot Start

```powershell
# Check service status
Get-Service MySQL80

# View error logs
Get-Content "C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err" -Tail 20
```

### Port 3306 Occupied

```powershell
# Find process using port
netstat -ano | findstr :3306

# Stop process using port (replace PID)
taskkill /PID <PID> /F
```

### Forgot root Password

Refer to MySQL official documentation to reset password, or reinstall.

---

## Recommended Configuration

- **MySQL Version**: 8.0 or higher
- **Port**: 3306 (default)
- **root Password**: pawpal_secure_2024! (consistent with .env file)
- **Character Set**: utf8mb4 (default)
