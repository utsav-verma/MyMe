# Use Node.js 18 with Chromium for WhatsApp Web.js
FROM node:18-slim

# Install Chromium and dependencies (works on both AMD64 and ARM64)
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    fonts-noto-color-emoji \
    fonts-noto-cjk \
    libxss1 \
    libgconf-2-4 \
    libxrandr2 \
    libasound2 \
    libpangocairo-1.0-0 \
    libatk1.0-0 \
    libcairo-gobject2 \
    libgtk-3-0 \
    libgdk-pixbuf2.0-0 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Build Next.js application
RUN npm run build

# Create directory for WhatsApp session data
RUN mkdir -p .wwebjs_service

# Expose ports
EXPOSE 3000 3001

# Set Chromium path for WhatsApp Web.js
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Create startup script
RUN echo '#!/bin/bash\n\
echo "Starting WhatsApp service..."\n\
node whatsapp-service.js &\n\
echo "Starting Next.js frontend..."\n\
npm start\n\
wait' > start.sh && chmod +x start.sh

# Start both services
CMD ["./start.sh"]