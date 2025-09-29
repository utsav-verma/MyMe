# MyMe - Unified WhatsApp Chat

A unified WhatsApp chat application available as both web app and **native iOS app**.

![WhatsApp Integration](https://img.shields.io/badge/WhatsApp-Web.js-25D366?style=flat&logo=whatsapp)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat&logo=next.js)
![iOS](https://img.shields.io/badge/iOS-Capacitor.js-007AFF?style=flat&logo=ios)
![Production Ready](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=flat)

## 🎯 Project Structure

```
MyMe/
├── 📁 webapp/              # Web application
│   ├── src/               # React components
│   ├── whatsapp-service.js # WhatsApp backend
│   └── package.json       # Web dependencies
├── 📁 ios/                # iOS application
│   ├── src/               # Mobile-optimized components
│   ├── capacitor.config.ts # iOS configuration
│   └── package.json       # iOS dependencies
├── 📁 docs/               # Documentation
└── 📄 README.md           # This file
```

## 🚀 Quick Start

### 📱 iOS App (Recommended)
```bash
# Prerequisites: macOS, Xcode 14+, Node.js 18+
cd ios
npm install

# Terminal 1: Start WhatsApp Backend
node whatsapp-service-ios.js

# Terminal 2: Build & Run iOS App
npm run export
npx cap sync ios
npx cap open ios
# Click ▶️ in Xcode to run
```
**📖 Complete Setup Guide**: [IOS_SETUP_GUIDE.md](IOS_SETUP_GUIDE.md)

### 🌐 Web App
```bash
cd webapp
npm install
node whatsapp-service.js    # Terminal 1
npm run dev                 # Terminal 2
```
Open http://localhost:3000

## ✨ Features

- **🔗 Real WhatsApp Integration** - Connect to your personal WhatsApp account
- **💬 Unified Chat Interface** - All conversations in one window
- **📱 Native iOS App** - Full iOS app with Capacitor.js
- **👤 Contact Management** - Search through 5987+ contacts with profile pictures
- **🌙 Dark/Light Mode** - iOS-native theme switching
- **⚡ Real-time Updates** - Instant message delivery and sync
- **🛡️ iOS Optimized** - Safe area support, status bar integration
- **🔄 Reply System** - Click messages to reply with contact info

## 📚 Documentation

### 📱 **iOS App Guides**
- **[iOS Setup Guide](IOS_SETUP_GUIDE.md)** - Complete iOS app setup and distribution
- **[iOS Error Tracking](IOS_ERROR_TRACKING.md)** - iOS-specific issues and solutions
- **[iOS Work Log](IOS_CURRENT_WORK_LOG.md)** - iOS development progress

### 📖 **User Guides**
- **[Web App Setup](webapp/README.md)** - Web application setup
- **[iOS App Setup](ios/README.md)** - iOS application setup

### 🔧 **Technical Documentation**
- **[System Design](docs/SYSTEM_DESIGN.md)** - Architecture and component design
- **[Master Reference](docs/MASTER_REFERENCE.md)** - Complete project overview
- **[PWA Implementation](docs/PWA_IMPLEMENTATION_PLAN.md)** - Progressive Web App features

### 🐛 **Development & Troubleshooting**
- **[Error Tracking](ERROR_TRACKING.md)** - Known issues and solutions
- **[Current Work Log](CURRENT_WORK_LOG.md)** - Latest development progress

## 🖥️ Web App vs iOS App

| Feature | Web App | iOS App |
|---------|---------|---------|
| **WhatsApp Service** | Local (whatsapp-service.js) | Cloud server |
| **Platform** | Browser | Native iOS |
| **Installation** | No installation | App Store |
| **Notifications** | Browser notifications | Native push |
| **Performance** | Good | Excellent |
| **Development** | Immediate | Requires Xcode |

## 🔧 Architecture

### Web App Architecture
```
Browser ↔ Next.js Frontend ↔ Local WhatsApp Service ↔ WhatsApp Web.js
```

### iOS App Architecture
```
iOS App ↔ Capacitor.js ↔ WhatsApp Backend ↔ WhatsApp Web.js
```

## 🌍 Global Distribution

### 🆓 Free Distribution (TestFlight)
```bash
# Build for TestFlight (up to 100 users)
npm run export
npx cap sync ios
# In Xcode: Product → Archive → TestFlight
```

### 💰 Paid Distribution (App Store)
- **Apple Developer Account**: $99/year
- **Global reach**: Unlimited users worldwide
- **Professional distribution**: App Store presence

### 🌐 Backend Options
```bash
# Free: Expose local backend globally
npm install -g ngrok
ngrok http 3001

# Paid: Cloud server deployment
# DigitalOcean/AWS: $5-10/month
```

## 🚀 Deployment

### Web App Deployment
- **Local**: Run locally for personal use
- **VPS**: Deploy to cloud server
- **Docker**: Container deployment available

### iOS App Deployment
- **Development**: Xcode simulator and device testing
- **TestFlight**: Beta testing distribution
- **App Store**: Public app store distribution

## 🤝 Contributing

1. Fork the repository
2. Choose webapp or ios folder
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational and personal use only.

---

**Built with ❤️ for unified WhatsApp communication**

### 🎯 Project Status: Production Ready! 🎉

**Available as:**
- ✅ **Web Application** - Ready for browser use
- ✅ **iOS Application** - Ready for mobile conversion
- ✅ **Documentation** - Complete guides for both platforms