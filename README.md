# MyMe - Unified WhatsApp Chat

A unified WhatsApp chat application that displays all your personal conversations in one window, allowing you to view and reply to messages from multiple contacts in a single interface.

![WhatsApp Integration](https://img.shields.io/badge/WhatsApp-Web.js-25D366?style=flat&logo=whatsapp)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat&logo=typescript)

## ✨ Features

- **🔗 Real WhatsApp Integration** - Connect to your personal WhatsApp account
- **💬 Unified Chat Interface** - All conversations in one window
- **📱 Message Sending & Receiving** - Full two-way communication
- **👤 Contact Management** - Smart contact loading with profile pictures
- **🌙 Dark/Light Mode** - Professional theme switching
- **📞 Contact Name Resolution** - Shows saved contact names
- **🖼️ Profile Pictures** - Automatic loading and refresh
- **⚡ Real-time Updates** - Instant message delivery

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- WhatsApp account with multi-device enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/utsav-verma/MyMe.git
   cd MyMe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   # Terminal 1: Start WhatsApp service
   node whatsapp-service.js
   
   # Terminal 2: Start frontend (new terminal)
   npm run dev
   ```

4. **Access the application**
   - Open http://localhost:3000 in your browser
   - Scan the QR code with your WhatsApp mobile app
   - Start chatting!

## 📱 How It Works

1. **WhatsApp Web.js** connects to your personal WhatsApp account
2. **Backend service** (port 3001) manages WhatsApp connection and messages
3. **Frontend interface** (port 3000) provides unified chat experience
4. **Real-time sync** keeps messages and contacts updated

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

## 📁 Project Structure

```
MyMe/
├── src/
│   ├── components/
│   │   ├── UnifiedChat.tsx      # Main chat interface
│   │   └── LoginPage.tsx        # Authentication
│   ├── types/
│   │   └── chat.ts              # TypeScript definitions
│   └── app/
│       ├── page.tsx             # Main page
│       └── globals.css          # Styles
├── docs/                        # Documentation
├── whatsapp-service.js          # WhatsApp backend service
├── package.json                 # Dependencies
└── README.md                    # This file
```

## 📚 Documentation

### 📖 **User Guides**
- **[Quick Start Guide](README.md)** - Get started in 5 minutes
- **[Mobile App Conversion](docs/MOBILE_CONVERSION_GUIDE.md)** - Convert to Android/iOS apps

### 🔧 **Technical Documentation**
- **[System Design](docs/SYSTEM_DESIGN.md)** - Architecture and component design
- **[Master Reference](docs/MASTER_REFERENCE.md)** - Complete project overview
- **[Project Status](docs/PROJECT_STATUS.md)** - Current implementation status

### 🐛 **Development & Troubleshooting**
- **[Error Tracking](docs/ERROR_TRACKING.md)** - Known issues and solutions
- **[Current Work Log](docs/CURRENT_WORK_LOG.md)** - Latest development progress
- **[WhatsApp Cloud API Setup](docs/WHATSAPP_CLOUD_API_SETUP.md)** - Alternative API setup

### 🐳 **Deployment**
- **[Docker Setup](docs/README-Docker.md)** - Docker deployment guide

## 🔍 Troubleshooting

### Common Issues

**QR Code not appearing:**
- Check if WhatsApp service is running on port 3001
- Ensure no other WhatsApp Web sessions are active

**Messages not loading:**
- Verify WhatsApp account has multi-device enabled
- Check console for connection errors

**Contact names not showing:**
- Contacts are prioritized by recent messages
- Saved contacts with names are loaded first

### Debug Mode
```bash
# Enable detailed logging
DEBUG=whatsapp-web.js:* node whatsapp-service.js
```

## 📊 Technical Stack

- **Backend**: Node.js + Express + WhatsApp Web.js
- **Frontend**: Next.js 14 + React + TypeScript
- **Styling**: Tailwind CSS
- **Browser**: Chromium/Chrome (via Puppeteer)
- **Authentication**: QR Code (like WhatsApp Web)

## 🖥️ Production Deployment

### VPS/Cloud Server (Recommended)
```bash
# On Ubuntu 22.04 server
sudo apt update && sudo apt install nodejs npm git
git clone https://github.com/utsav-verma/MyMe.git
cd MyMe
npm install
npm run build

# Start services
node whatsapp-service.js &
npm start
```

### Supported Platforms
- ✅ **Local Development** (Windows, macOS, Linux)
- ✅ **VPS/Cloud Servers** (Ubuntu, CentOS, Debian)
- ✅ **Dedicated Servers**
- ❌ **Docker** (Not compatible due to Chromium limitations)

## 📱 Mobile App Development

Ready to convert to mobile apps! See our comprehensive [Mobile Conversion Guide](docs/MOBILE_CONVERSION_GUIDE.md) for:

- **Capacitor.js** conversion (1-2 weeks)
- **React Native** alternative (2-3 months)
- **PWA** quick solution
- Step-by-step implementation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## ⚠️ Important Notes

- **Personal Use Only**: This app connects to your personal WhatsApp account
- **WhatsApp Terms**: Ensure compliance with WhatsApp's Terms of Service
- **Security**: Keep your session data secure and private
- **Rate Limits**: Respect WhatsApp's usage limits

## 📄 License

This project is for educational and personal use only.

## 🆘 Support

If you encounter issues:
1. Check the [troubleshooting section](#-troubleshooting)
2. Review [Error Tracking](docs/ERROR_TRACKING.md) for known solutions
3. Check console logs for errors
4. Ensure all prerequisites are met

---

**Built with ❤️ for unified WhatsApp communication**

### 🎯 Project Status: 100% Complete - Production Ready! 🎉

**Ready for:**
- ✅ Personal use and deployment
- ✅ Mobile app conversion
- ✅ Production server deployment
- ✅ Further customization and enhancement