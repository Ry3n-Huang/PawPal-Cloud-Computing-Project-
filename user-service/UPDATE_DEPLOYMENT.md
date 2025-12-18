# Update Cloud Service - Swagger Documentation Update

## 📋 Modified Files

This update modified the following files:
- `src/routes/dogRoutes.js` - Added complete Swagger annotations (including PUT, POST, DELETE)
- `src/routes/swaggerRoutes.js` - Adjusted Swagger UI configuration (disabled filtering, expanded all endpoints)

## 🚀 Deployment Steps

### Method 1: Using Git (Recommended)

If you're using Git to manage code on GCP VM:

1. **Commit changes locally**
   ```bash
   cd user-service
   git add src/routes/dogRoutes.js src/routes/swaggerRoutes.js
   git commit -m "Update Swagger documentation for Dogs endpoints"
   git push
   ```

2. **SSH to GCP VM**
   ```bash
   # Using gcloud
   gcloud compute ssh <VM_NAME> --zone=<ZONE>
   
   # Or direct SSH
   ssh user@34.9.57.25
   ```

3. **Update code on VM**
   ```bash
   cd /opt/pawpal/user-service
   git pull
   ```

4. **Restart service**
   ```bash
   # If using PM2
   pm2 restart user-service
   
   # Or if using systemd
   sudo systemctl restart user-service
   ```

5. **Verify update**
   ```bash
   # Check service status
   pm2 status
   # Or
   sudo systemctl status user-service
   
   # Test Swagger UI
   curl http://localhost:3001/api-docs/swagger.json | grep -i "put\|post" | head -5
   ```

### Method 2: Direct File Upload (If not using Git)

1. **Package modified files locally**
   ```bash
   # In project root directory
   cd user-service
   tar -czf swagger-update.tar.gz src/routes/dogRoutes.js src/routes/swaggerRoutes.js
   ```

2. **Upload to GCP VM**
   ```bash
   # Using gcloud
   gcloud compute scp swagger-update.tar.gz <VM_NAME>:/tmp/ --zone=<ZONE>
   
   # Or using SCP
   scp swagger-update.tar.gz user@34.9.57.25:/tmp/
   ```

3. **SSH to VM and update files**
   ```bash
   ssh user@34.9.57.25
   cd /opt/pawpal/user-service
   
   # Backup original files (optional)
   cp src/routes/dogRoutes.js src/routes/dogRoutes.js.backup
   cp src/routes/swaggerRoutes.js src/routes/swaggerRoutes.js.backup
   
   # Extract and overwrite
   tar -xzf /tmp/swagger-update.tar.gz
   ```

4. **Restart service**
   ```bash
   # If using PM2
   pm2 restart user-service
   
   # Or if using systemd
   sudo systemctl restart user-service
   ```

5. **Verify update**
   ```bash
   # Check service logs
   pm2 logs user-service --lines 20
   # Or
   sudo journalctl -u user-service -n 20
   
   # Test Swagger
   curl http://localhost:3001/api-docs/swagger.json | grep -i "put\|post" | head -5
   ```

## ✅ Verify Update Success

1. **Access Swagger UI**
   - Open browser and visit: `http://34.9.57.25:3001/api-docs/`
   - Check if you can see under "Dogs" tag:
     - ✅ `POST /api/dogs` - Create new dog
     - ✅ `PUT /api/dogs/{id}` - Update dog
     - ✅ `DELETE /api/dogs/{id}` - Delete dog

2. **Check Swagger JSON**
   ```bash
   curl http://34.9.57.25:3001/api-docs/swagger.json | jq '.paths["/api/dogs/{id}"]'
   ```
   Should see `get`, `put`, `delete` three methods.

3. **Test endpoints**
   ```bash
   # Test health check
   curl http://34.9.57.25:3001/health
   
   # Test Swagger JSON
   curl http://34.9.57.25:3001/api-docs/swagger.json
   ```

## 🔧 Troubleshooting

### Service cannot start

1. **Check logs**
   ```bash
   pm2 logs user-service --err
   # Or
   sudo journalctl -u user-service -n 50
   ```

2. **Check syntax errors**
   ```bash
   cd /opt/pawpal/user-service
   node -c src/routes/dogRoutes.js
   node -c src/routes/swaggerRoutes.js
   ```

3. **Check file permissions**
   ```bash
   ls -la src/routes/
   ```

### Swagger UI not updated

1. **Clear browser cache**
   - Hard refresh: `Ctrl + Shift + R` or `Ctrl + F5`

2. **Check if service restarted**
   ```bash
   pm2 list
   # Or
   sudo systemctl status user-service
   ```

3. **Check if files are correctly updated**
   ```bash
   cd /opt/pawpal/user-service
   grep -n "filter: false" src/routes/swaggerRoutes.js
   grep -n "put:" src/routes/dogRoutes.js | head -3
   ```

## 📝 Notes

- ⚠️ Recommend backing up original files before update
- ⚠️ Ensure `.env` file is correctly configured
- ⚠️ If using PM2, ensure `pm2 save` to save configuration
- ⚠️ Wait a few seconds after update for service to fully start

## 🎯 Quick Update Commands (If using Git)

```bash
# Locally
cd user-service
git add src/routes/dogRoutes.js src/routes/swaggerRoutes.js
git commit -m "Update Swagger docs"
git push

# On GCP VM (after SSH)
cd /opt/pawpal/user-service
git pull && pm2 restart user-service
```
