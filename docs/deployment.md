# AquaSutra Deployment Guide

This document provides comprehensive instructions for deploying the AquaSutra water hazard monitoring system in both development and production environments.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Development Deployment](#development-deployment)
- [Production Deployment](#production-deployment)
  - [Backend Deployment](#backend-deployment)
  - [Frontend Deployment](#frontend-deployment)
  - [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying AquaSutra, ensure you have the following:

- Node.js (v14+)
- npm (v6+)
- PostgreSQL (v12+) with PostGIS extension
- Python (v3.7+) with pip
- Git

## Development Deployment

For local development:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-organization/aquasutra.git
   cd aquasutra
   ```

2. **Run the setup script**:
   ```bash
   node setup.js
   ```
   This script will:
   - Install all dependencies (backend, frontend, and Python)
   - Generate mock data
   - Create default environment files

3. **Start the development servers**:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

4. Access the application at `http://localhost:3000`

## Production Deployment

### Backend Deployment

1. **Server Preparation**:
   - Set up a Linux server (Ubuntu 20.04 LTS recommended)
   - Install Node.js, npm, PostgreSQL with PostGIS, and Python 3

2. **Clone and Setup**:
   ```bash
   git clone https://github.com/your-organization/aquasutra.git
   cd aquasutra
   node setup.js
   ```

3. **Configure Environment Variables**:
   Edit the `.env` file in the backend directory with production values:
   ```
   PORT=5000
   DB_HOST=your-db-host
   DB_NAME=aquasutra
   DB_USER=your-db-user
   DB_PASSWORD=your-secure-password
   JWT_SECRET=your-secure-jwt-secret
   AWS_ACCESS_KEY_ID=your-aws-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret
   AWS_REGION=your-aws-region
   AWS_S3_BUCKET=your-s3-bucket
   NODE_ENV=production
   ```

4. **Install PM2 for Process Management**:
   ```bash
   npm install -g pm2
   ```

5. **Build and Deploy Backend**:
   ```bash
   cd backend
   npm install --production
   pm2 start server.js --name "aquasutra-backend"
   pm2 save
   pm2 startup
   ```

6. **Configure Nginx as Reverse Proxy**:
   ```bash
   sudo apt install nginx
   ```

   Create a new Nginx configuration:
   ```bash
   sudo nano /etc/nginx/sites-available/aquasutra-backend
   ```

   Add the following configuration:
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable the configuration:
   ```bash
   sudo ln -s /etc/nginx/sites-available/aquasutra-backend /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. **Set Up SSL with Let's Encrypt**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.yourdomain.com
   ```

### Frontend Deployment

1. **Build the Frontend**:
   ```bash
   cd frontend
   
   # Update the .env file with production API URL
   echo "REACT_APP_API_URL=https://api.yourdomain.com/api" > .env
   echo "REACT_APP_SOCKET_URL=https://api.yourdomain.com" >> .env
   
   npm run build
   ```

2. **Deploy to Web Server**:
   
   Option 1: Nginx static hosting:
   ```bash
   sudo mkdir -p /var/www/aquasutra
   sudo cp -r build/* /var/www/aquasutra/
   ```

   Create Nginx configuration:
   ```bash
   sudo nano /etc/nginx/sites-available/aquasutra-frontend
   ```

   Add the following:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       root /var/www/aquasutra;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

   Enable and restart:
   ```bash
   sudo ln -s /etc/nginx/sites-available/aquasutra-frontend /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

   Option 2: Deploy to AWS S3 + CloudFront:
   ```bash
   # Install AWS CLI
   pip install awscli
   aws configure

   # Create S3 bucket and upload
   aws s3 mb s3://aquasutra-frontend
   aws s3 sync build/ s3://aquasutra-frontend --acl public-read
   ```

   Then set up CloudFront distribution pointing to the S3 bucket.

### Database Setup

1. **Create Production Database**:
   ```bash
   sudo -u postgres psql
   ```

   In PostgreSQL shell:
   ```sql
   CREATE DATABASE aquasutra;
   CREATE USER aquasutra_user WITH ENCRYPTED PASSWORD 'your-secure-password';
   GRANT ALL PRIVILEGES ON DATABASE aquasutra TO aquasutra_user;
   \c aquasutra
   CREATE EXTENSION postgis;
   \q
   ```

2. **Database Migrations**:
   The database schema will be automatically created when the backend starts for the first time.

## Environment Configuration

### Security Best Practices

1. **JWT Secret**: Use a strong, unique secret for JWT token generation
2. **Database Credentials**: Use strong passwords and limit database user permissions
3. **AWS Credentials**: Create IAM users with minimal required permissions
4. **Environment Variables**: Never commit .env files to version control

### Scaling Considerations

1. **Database**: Consider using connection pooling and read replicas for high traffic
2. **Backend**: Deploy multiple instances behind a load balancer
3. **Media Storage**: Use AWS S3 or similar for scalable media storage
4. **Caching**: Implement Redis for caching frequently accessed data

## Monitoring and Maintenance

1. **PM2 Monitoring**:
   ```bash
   pm2 monit
   pm2 logs aquasutra-backend
   ```

2. **Database Backups**:
   ```bash
   # Set up daily backups
   sudo -u postgres pg_dump aquasutra > /backup/aquasutra_$(date +%Y%m%d).sql
   ```

3. **Log Rotation**:
   ```bash
   sudo nano /etc/logrotate.d/aquasutra
   ```

   Add:
   ```
   /home/ubuntu/.pm2/logs/*.log {
       daily
       rotate 7
       compress
       delaycompress
       missingok
       notifempty
       create 0640 ubuntu ubuntu
   }
   ```

## Troubleshooting

### Common Issues

1. **Backend Connection Errors**:
   - Check if the backend server is running: `pm2 status`
   - Verify Nginx configuration: `sudo nginx -t`
   - Check firewall settings: `sudo ufw status`

2. **Database Connection Issues**:
   - Verify PostgreSQL is running: `sudo systemctl status postgresql`
   - Check database credentials in .env file
   - Ensure PostGIS extension is installed

3. **Frontend Not Loading**:
   - Check browser console for errors
   - Verify API URL in frontend .env file
   - Check if the backend API is accessible

4. **Socket.io Connection Issues**:
   - Ensure WebSocket connections are allowed in Nginx configuration
   - Check CORS settings in backend server.js

For additional support, please open an issue on the GitHub repository or contact the development team.