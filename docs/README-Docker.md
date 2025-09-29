# MyMe WhatsApp Chat - Docker Deployment

## Quick Start

### Using Docker Compose (Recommended)
```bash
# Build and start the application
docker-compose up --build

# Run in background
docker-compose up -d --build
```

### Using Docker directly
```bash
# Build the image
docker build -t myme-chat .

# Run the container
docker run -p 3000:3000 -p 3001:3001 -v myme_data:/app/.wwebjs_service myme-chat
```

## Access the Application

1. **Frontend**: http://localhost:3000
2. **Backend API**: http://localhost:3001
3. **QR Code**: Visit frontend to scan WhatsApp QR code

## Features

- ✅ Complete WhatsApp integration
- ✅ Unified chat interface with dark mode
- ✅ Contact management with profile pictures
- ✅ Message sending and receiving
- ✅ Persistent WhatsApp session data
- ✅ Containerized for easy deployment

## Deployment Notes

- **Session Persistence**: WhatsApp session data is stored in Docker volume
- **First Run**: Scan QR code to authenticate WhatsApp
- **Ports**: 3000 (frontend), 3001 (WhatsApp service)
- **Chrome**: Included for WhatsApp Web.js compatibility

## Stopping the Application

```bash
# Stop containers
docker-compose down

# Stop and remove volumes (will require re-authentication)
docker-compose down -v
```