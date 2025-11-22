# User Service Deployment Guide - Cloud Compute (VM)

This guide explains how to deploy the User Service on Google Cloud Compute Engine (VM).

## Prerequisites

- Google Cloud Platform account
- gcloud CLI installed and configured
- MySQL database (can be on the same VM or separate VM)

## Step 1: Create VM Instance

```bash
# Create VM instance
gcloud compute instances create user-service-vm \
  --zone=us-central1-a \
  --machine-type=e2-medium \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=20GB \
  --tags=http-server,https-server

# Allow HTTP traffic
gcloud compute firewall-rules create allow-http \
  --allow tcp:80 \
  --source-ranges 0.0.0.0/0 \
  --target-tags http-server

# Allow custom port (if not using 80)
gcloud compute firewall-rules create allow-user-service \
  --allow tcp:3001 \
  --source-ranges 0.0.0.0/0 \
  --target-tags http-server
```

## Step 2: SSH into VM

```bash
gcloud compute ssh user-service-vm --zone=us-central1-a
```

## Step 3: Install Dependencies on VM

```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL client (if needed)
sudo apt-get install -y mysql-client

# Install PM2 for process management
sudo npm install -g pm2

# Install Git
sudo apt-get install -y git
```

## Step 4: Clone and Setup Application

```bash
# Create application directory
sudo mkdir -p /opt/pawpal
sudo chown $USER:$USER /opt/pawpal
cd /opt/pawpal

# Clone repository (or upload files)
git clone <your-repo-url> .
cd user-service

# Install dependencies
npm install --production
```

## Step 5: Configure Environment

```bash
# Copy environment template
cp config/database.env.example .env

# Edit environment file
nano .env
```

Set the following variables:

```env
NODE_ENV=production
PORT=3001
DB_HOST=<your-mysql-host>
DB_PORT=3306
DB_USERNAME=<your-db-username>
DB_PASSWORD=<your-db-password>
DB_NAME=pawpal_db
DB_POOL_MAX=10
ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-domain.com
SKIP_DB=false
```

## Step 6: Setup Database

If MySQL is on the same VM:

```bash
# Install MySQL Server
sudo apt-get install -y mysql-server

# Secure MySQL installation
sudo mysql_secure_installation

# Create database and user
mysql -u root -p < ../database/schema.sql
mysql -u root -p pawpal_db < ../database/sample_data.sql
```

If MySQL is on a separate VM, ensure:
- MySQL allows remote connections
- Firewall rules allow connection from user-service VM
- Database user has proper permissions

## Step 7: Create Systemd Service

Create service file:

```bash
sudo nano /etc/systemd/system/user-service.service
```

Add the following content:

```ini
[Unit]
Description=PawPal User Service
After=network.target mysql.service

[Service]
Type=simple
User=your-username
WorkingDirectory=/opt/pawpal/user-service
Environment=NODE_ENV=production
EnvironmentFile=/opt/pawpal/user-service/.env
ExecStart=/usr/bin/node src/app.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=user-service

[Install]
WantedBy=multi-user.target
```

Replace `your-username` with your actual username.

## Step 8: Start Service

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable user-service

# Start service
sudo systemctl start user-service

# Check status
sudo systemctl status user-service

# View logs
sudo journalctl -u user-service -f
```

## Step 9: Setup Nginx Reverse Proxy (Optional)

If you want to use port 80/443:

```bash
# Install Nginx
sudo apt-get install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/user-service
```

Add configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and start Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/user-service /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 10: Verify Deployment

```bash
# Test health endpoint
curl http://localhost:3001/health

# Test from external IP
curl http://<VM_EXTERNAL_IP>:3001/health
```

## Monitoring and Maintenance

### View Logs

```bash
# Systemd logs
sudo journalctl -u user-service -f

# Application logs (if using PM2)
pm2 logs user-service
```

### Restart Service

```bash
sudo systemctl restart user-service
```

### Update Application

```bash
cd /opt/pawpal/user-service
git pull
npm install --production
sudo systemctl restart user-service
```

## Troubleshooting

### Service won't start

1. Check logs: `sudo journalctl -u user-service -n 50`
2. Verify environment variables: `sudo systemctl show user-service`
3. Test database connection manually
4. Check port availability: `sudo netstat -tulpn | grep 3001`

### Database connection issues

1. Verify MySQL is running: `sudo systemctl status mysql`
2. Test connection: `mysql -h <host> -u <user> -p`
3. Check firewall rules
4. Verify credentials in .env file

### Port already in use

```bash
# Find process using port
sudo lsof -i :3001

# Kill process if needed
sudo kill -9 <PID>
```

## Security Considerations

1. **Firewall**: Only expose necessary ports
2. **Database**: Use strong passwords, limit access
3. **Environment Variables**: Keep .env file secure (chmod 600)
4. **HTTPS**: Use SSL/TLS in production (consider Cloud Load Balancer)
5. **Updates**: Keep system and dependencies updated

## Backup

```bash
# Backup database
mysqldump -u root -p pawpal_db > backup_$(date +%Y%m%d).sql

# Backup application
tar -czf user-service-backup-$(date +%Y%m%d).tar.gz /opt/pawpal/user-service
```

