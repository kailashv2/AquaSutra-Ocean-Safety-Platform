# AquaSutra Quick Start Guide

This guide will help you get the AquaSutra water hazard monitoring system up and running quickly.

## Prerequisites

- Node.js (v14+)
- npm (v6+)
- PostgreSQL with PostGIS extension
- Python 3.7+

## Installation

1. **Run the setup script**:

```bash
node setup.js
```

This script automatically:
- Installs all dependencies
- Creates necessary directories
- Generates mock data
- Sets up default environment files

2. **Start the application**:

```bash
# Start the backend
cd backend
npm run dev

# In a new terminal, start the frontend
cd frontend
npm start
```

3. **Access the application**:

Open your browser and navigate to: http://localhost:3000

## Default Accounts

The system comes with pre-generated accounts for testing:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@aquasutra.com | password123 |
| Moderator | mod@aquasutra.com | password123 |
| User | user@aquasutra.com | password123 |

## Key Features

- **Hazard Reporting**: Submit and track water hazard reports
- **Interactive Map**: View hazards on a geospatial map
- **Analytics Dashboard**: View trends and statistics
- **Social Media Integration**: Monitor water-related social media posts
- **Offline Support**: Continue using the app without internet connection

## Next Steps

For detailed information, refer to:
- [Full Documentation](../README.md)
- [Deployment Guide](./deployment.md)