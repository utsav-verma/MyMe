# MyMe Web App

Web version of MyMe WhatsApp Chat with local WhatsApp service.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- WhatsApp account with multi-device enabled

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the application**
   ```bash
   # Terminal 1: Start WhatsApp service
   node whatsapp-service.js
   
   # Terminal 2: Start frontend (new terminal)
   npm run dev
   ```

3. **Access the application**
   - Open http://localhost:3000 in your browser
   - Scan the QR code with your WhatsApp mobile app
   - Start chatting!

## 📁 Structure

```
webapp/
├── src/
│   ├── components/
│   │   ├── UnifiedChat.tsx      # Main chat interface
│   │   └── LoginPage.tsx        # Authentication
│   ├── types/
│   │   └── chat.ts              # TypeScript definitions
│   └── app/
│       ├── page.tsx             # Main page
│       └── globals.css          # Styles
├── whatsapp-service.js          # WhatsApp backend service
└── package.json                 # Dependencies
```

## 🔧 Configuration

### Environment Variables
Create `.env.local`:
```
WHATSAPP_SESSION_PATH=./.wwebjs_auth
```

### WhatsApp Service
The `whatsapp-service.js` runs on port 3001 and handles:
- WhatsApp Web.js connection
- QR code generation
- Message sending/receiving
- Contact management

## 🎯 Usage

### First Time Setup
1. Run both services (backend + frontend)
2. Open http://localhost:3000
3. Scan QR code with WhatsApp mobile app
4. Your conversations will load automatically

### Daily Usage
1. Start both services
2. View all conversations in unified interface
3. Click any message to reply
4. Send messages directly to WhatsApp contacts

## 🔍 Troubleshooting

**QR Code not appearing:**
- Check if WhatsApp service is running on port 3001
- Ensure no other WhatsApp Web sessions are active

**Messages not loading:**
- Verify WhatsApp account has multi-device enabled
- Check console for connection errors

## 📊 Technical Stack

- **Backend**: Node.js + Express + WhatsApp Web.js
- **Frontend**: Next.js 14 + React + TypeScript
- **Styling**: Tailwind CSS
- **Browser**: Chromium/Chrome (via Puppeteer)
- **Authentication**: QR Code (like WhatsApp Web)

## 🖥️ Production Deployment

### VPS/Cloud Server
```bash
# On Ubuntu 22.04 server
sudo apt update && sudo apt install nodejs npm git
git clone https://github.com/utsav-verma/MyMe.git
cd MyMe/webapp
npm install
npm run build

# Start services
node whatsapp-service.js &
npm start
```

## ⚠️ Important Notes

- **Personal Use Only**: This app connects to your personal WhatsApp account
- **WhatsApp Terms**: Ensure compliance with WhatsApp's Terms of Service
- **Security**: Keep your session data secure and private
- **Rate Limits**: Respect WhatsApp's usage limits