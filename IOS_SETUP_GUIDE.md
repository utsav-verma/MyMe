# iOS WhatsApp App - Setup & Run Guide

## 🎯 **Quick Start**

### **Prerequisites**
- **macOS** (required for iOS development)
- **Xcode 14+** (free from App Store)
- **Node.js 18+** (download from nodejs.org)
- **Git** (pre-installed on macOS)

### **Installation Steps**

#### **1. Clone Repository**
```bash
git clone <repository-url>
cd MyMe/ios
```

#### **2. Install Dependencies**
```bash
npm install
```

#### **3. Start WhatsApp Backend**
```bash
# Terminal 1 - Start WhatsApp Service
node whatsapp-service-ios.js
```
**Expected Output:**
```
🚀 Starting standalone WhatsApp service...
✅ WhatsApp service running on http://localhost:3001
📱 Creating WhatsApp client...
✅ WhatsApp authenticated!
```

#### **4. Build & Run iOS App**
```bash
# Terminal 2 - Build for iOS
npm run export
npx cap sync ios
npx cap open ios
```

#### **5. Run in Xcode**
1. **Xcode opens automatically**
2. **Select iPhone Simulator** (iPhone 14 Pro recommended)
3. **Click ▶️ Run button**
4. **App launches in simulator**

---

## 📱 **Using the App**

### **First Time Setup**
1. **App opens** → Shows "Connect WhatsApp" button
2. **Click "Connect WhatsApp"** → QR code appears
3. **Open WhatsApp on phone** → Settings → Linked Devices
4. **Scan QR code** → App connects automatically
5. **Messages load** → Start chatting!

### **App Features**
- ✅ **Send/Receive Messages** - Real-time WhatsApp messaging
- ✅ **Contact Search** - Search through all contacts
- ✅ **Dark/Light Mode** - Toggle theme with moon/sun icon
- ✅ **Profile Pictures** - View contact avatars
- ✅ **Message History** - Access chat history
- ✅ **Reply System** - Click messages to reply

---

## 🌐 **Sharing with Others**

### **Option 1: TestFlight (Free Beta)**
```bash
# Build for distribution
npm run build
npx cap sync ios

# In Xcode:
# Product → Archive → Distribute App → TestFlight
# Share TestFlight link with users (up to 100 people)
```

### **Option 2: Direct IPA Sharing**
```bash
# Build release version
npm run build
npx cap sync ios

# In Xcode:
# Product → Archive → Export → Development
# Share .ipa file directly
```

### **Option 3: Global Backend (Recommended)**
```bash
# Install ngrok for global access
npm install -g ngrok

# Terminal 1: Start backend
node whatsapp-service-ios.js

# Terminal 2: Expose globally
ngrok http 3001
# Copy https URL (e.g., https://abc123.ngrok.io)

# Update app to use ngrok URL instead of localhost
# Build and share with anyone worldwide
```

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **"WhatsApp service not available"**
```bash
# Check if backend is running
curl http://localhost:3001/status

# If not working, restart:
node whatsapp-service-ios.js
```

#### **"Cannot connect to localhost"**
```bash
# Clear iOS simulator cache
# Device → Erase All Content and Settings
# Rebuild app: npm run export && npx cap sync ios
```

#### **"Build failed in Xcode"**
```bash
# Clean build folder
# Product → Clean Build Folder
# Try building again
```

#### **"QR code not appearing"**
```bash
# Check backend logs for errors
# Restart WhatsApp service:
node whatsapp-service-ios.js
```

---

## 📋 **Development Commands**

### **Backend Commands**
```bash
node whatsapp-service-ios.js    # Start WhatsApp service
curl http://localhost:3001/status  # Check service status
```

### **Frontend Commands**
```bash
npm run dev                     # Development server
npm run build                   # Production build
npm run export                  # Export for iOS
npx cap sync ios               # Sync to iOS project
npx cap open ios               # Open in Xcode
```

### **iOS Build Commands**
```bash
# Development build
npm run export && npx cap sync ios

# Production build
npm run build && npx cap sync ios

# Open Xcode
npx cap open ios
```

---

## 🚀 **Deployment Options**

### **Local Development**
- **Backend**: Runs on your laptop (localhost:3001)
- **Frontend**: iOS simulator or connected iPhone
- **Users**: Only you can use it

### **Global Deployment**
- **Backend**: Deploy to cloud server (DigitalOcean, AWS)
- **Frontend**: Distribute via TestFlight or App Store
- **Users**: Anyone worldwide can use it

### **Cost Breakdown**
- **Development**: **Free** (just need Xcode)
- **TestFlight**: **Free** (up to 100 beta users)
- **App Store**: **$99/year** (Apple Developer Account)
- **Cloud Server**: **$5-10/month** (for global backend)

---

## 📞 **Support**

### **If App Doesn't Work**
1. **Check backend is running** → `curl http://localhost:3001/status`
2. **Restart WhatsApp service** → `node whatsapp-service-ios.js`
3. **Clear iOS cache** → Device → Erase All Content and Settings
4. **Rebuild app** → `npm run export && npx cap sync ios`

### **For Global Distribution**
1. **Set up ngrok** → `npm install -g ngrok`
2. **Expose backend** → `ngrok http 3001`
3. **Update app URLs** → Replace localhost with ngrok URL
4. **Build and share** → TestFlight or direct IPA

---

## ✅ **Success Checklist**

- [ ] **Node.js installed** (check: `node --version`)
- [ ] **Xcode installed** (check: open Xcode)
- [ ] **Dependencies installed** (`npm install` completed)
- [ ] **Backend running** (see "WhatsApp service running" message)
- [ ] **iOS app built** (`npx cap open ios` opens Xcode)
- [ ] **App runs in simulator** (see WhatsApp interface)
- [ ] **QR code appears** (after clicking "Connect WhatsApp")
- [ ] **WhatsApp connected** (scan QR with phone)
- [ ] **Messages working** (can send/receive messages)

**🎉 Your iOS WhatsApp app is ready to use!**