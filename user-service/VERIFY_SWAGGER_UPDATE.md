# Verify Swagger Update

## Issue
Swagger UI does not show updates for Dogs endpoints (PUT, POST, etc.)

## Verification Steps

### 1. Check if code has been updated

```bash
# On GCP VM
cd /opt/pawpal/Cloud-Computing-Database/user-service

# Check if dogRoutes.js contains Swagger annotations for PUT method
grep -n "put:" src/routes/dogRoutes.js | head -5

# Check swaggerRoutes.js configuration
grep -n "filter: false" src/routes/swaggerRoutes.js
grep -n "docExpansion" src/routes/swaggerRoutes.js
```

### 2. Check if Swagger JSON contains updates

```bash
# Directly view generated Swagger JSON
curl http://localhost:3001/api-docs/swagger.json | jq '.paths["/api/dogs/{id}"]'

# Or check if put method exists
curl http://localhost:3001/api-docs/swagger.json | grep -A 10 '"put"'
```

### 3. Clear browser cache

In browser:
- Press `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac) for hard refresh
- Or open Developer Tools (F12), right-click refresh button, select "Empty Cache and Hard Reload"

### 4. Check if service loaded latest code

```bash
# View service start time
pm2 info user-service

# Restart service to ensure latest code is loaded
pm2 restart user-service

# View logs to confirm
pm2 logs user-service --lines 20
```

### 5. Directly access Swagger JSON to verify

Open in browser:
```
http://34.9.57.25:3001/api-docs/swagger.json
```

Search for `"/api/dogs/{id}"`, should see `get`, `put`, `delete` three methods.
