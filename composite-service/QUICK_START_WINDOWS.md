# Windows Quick Start Guide

## Prerequisites

1. **Install Node.js** (version 16 or higher)
   - Download: https://nodejs.org/
   - Verify installation: Run `node --version` in PowerShell

2. **Ensure User Service is running** (port 3001)
   - Composite Service needs to connect to User Service

## Startup Steps

### 1. Open PowerShell or Command Prompt

In Windows, you can use:
- **PowerShell** (recommended)
- **Command Prompt (CMD)**
- **Windows Terminal**

### 2. Navigate to Project Directory

```powershell
# Navigate to composite-service directory
cd "E:\ColumbiaU\2025 Fall\PawPal-Cloud-Computing-Project-\composite-service"
```

### 3. Install Dependencies

```powershell
npm install
```

### 4. Configure Environment Variables (Optional)

If you need custom configuration, create `.env` file:

```powershell
# Create .env file in composite-service directory
# Can use Notepad or PowerShell

# PowerShell create file example:
@"
PORT=3002
USER_SERVICE_URL=http://localhost:3001
DOG_SERVICE_URL=http://localhost:3001
NODE_ENV=development
"@ | Out-File -FilePath .env -Encoding utf8
```

Or manually create `.env` file with following content:
```
PORT=3002
USER_SERVICE_URL=http://localhost:3001
DOG_SERVICE_URL=http://localhost:3001
NODE_ENV=development
```

### 5. Start Service

**Development mode** (recommended, supports auto-restart):
```powershell
npm run dev
```

**Production mode**:
```powershell
npm start
```

Or directly use Node.js:
```powershell
node src/app.js
```

## Verify Service Started Successfully

After successful startup, you should see output similar to:

```
🚀 PawPal Composite Service running on port 3002
🏥 Health Check: http://localhost:3002/health
🌐 Environment: development
📡 User Service URL: http://localhost:3001
📡 Dog Service URL: http://localhost:3001
```

## Test Service

Test in browser or PowerShell:

```powershell
# Test health check
curl http://localhost:3002/health

# Or use PowerShell's Invoke-WebRequest
Invoke-WebRequest -Uri http://localhost:3002/health
```

## Common Issues

### 1. Port Occupied

If port 3002 is occupied, you can:
- Modify `PORT` value in `.env` file
- Or close program using the port

### 2. User Service Not Running

If you see connection errors, ensure User Service is running on port 3001:
```powershell
# Check if User Service is running
curl http://localhost:3001/health
```

### 3. Dependency Installation Failed

If `npm install` fails:
```powershell
# Clear cache and reinstall
npm cache clean --force
npm install
```

### 4. Permission Issues

If you encounter permission issues, run PowerShell as Administrator:
- Right-click PowerShell
- Select "Run as administrator"

## Stop Service

Press `Ctrl + C` in the terminal running the service to stop it.

## Default Configuration

If you don't create `.env` file, service will use following defaults:
- **Port**: 3002
- **User Service URL**: http://localhost:3001
- **Dog Service URL**: http://localhost:3001

## Next Steps

After service starts, you can:
1. Visit http://localhost:3002/health to check health status
2. Visit http://localhost:3002/ to view API information
3. Use API endpoints for testing
