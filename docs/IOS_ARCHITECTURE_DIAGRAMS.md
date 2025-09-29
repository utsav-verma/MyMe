# iOS WhatsApp App - Architectural Diagrams

## 🏗️ High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        iOS WhatsApp App                         │
│                     (React Native 0.74.x)                      │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP API Calls
                                    │ (localhost:3002)
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                   WhatsApp Backend Service                      │
│                      (Node.js + Express)                       │
│                        Port: 3002                              │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    │ WhatsApp Web.js
                                    │ Puppeteer Integration
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      WhatsApp Web                               │
│                   (web.whatsapp.com)                           │
│                    Real WhatsApp API                           │
└─────────────────────────────────────────────────────────────────┘
```

### **System Components:**

**1. iOS App Layer (React Native)**
- Native iOS application
- React Navigation for screens
- HTTP client for API communication
- Local state management

**2. Backend Service Layer (Node.js)**
- Dedicated iOS WhatsApp service
- Express.js REST API
- Session management
- Message/Contact handling

**3. WhatsApp Integration Layer**
- WhatsApp Web.js library
- Puppeteer browser automation
- Real WhatsApp Web interface
- Authentication & QR code handling

---

## 🔧 Low-Level Architecture Diagram

### **iOS App Internal Architecture**

```
┌─────────────────────────────────────────────────────────────────┐
│                        iOS App (React Native)                   │
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐ │
│  │   App.tsx       │    │  Navigation     │    │   Screens   │ │
│  │                 │    │                 │    │             │ │
│  │ • State Mgmt    │◄──►│ • Stack Nav     │◄──►│ • Connection│ │
│  │ • API Calls     │    │ • Route Mgmt    │    │ • Chat      │ │
│  │ • Data Flow     │    │ • Screen Trans  │    │ • Settings  │ │
│  └─────────────────┘    └─────────────────┘    └─────────────┘ │
│           │                       │                       │    │
│           ▼                       ▼                       ▼    │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐ │
│  │   Services      │    │   Components    │    │   Types     │ │
│  │                 │    │                 │    │             │ │
│  │ • WhatsApp API  │    │ • MessageList   │    │ • Contact   │ │
│  │ • HTTP Client   │    │ • ContactList   │    │ • Message   │ │
│  │ • Data Parser   │    │ • InputField    │    │ • Status    │ │
│  └─────────────────┘    └─────────────────┘    └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP Requests
                                    │ (GET/POST)
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend Service (Node.js)                    │
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐ │
│  │   Express App   │    │   API Routes    │    │  WhatsApp   │ │
│  │                 │    │                 │    │  Client     │ │
│  │ • CORS Setup    │◄──►│ • /status       │◄──►│ • QR Code   │ │
│  │ • JSON Parser   │    │ • /messages     │    │ • Auth      │ │
│  │ • Error Handle  │    │ • /contacts     │    │ • Events    │ │
│  │ • Port 3002     │    │ • /send         │    │ • Session   │ │
│  └─────────────────┘    └─────────────────┘    └─────────────┘ │
│           │                       │                       │    │
│           ▼                       ▼                       ▼    │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐ │
│  │   Data Store    │    │   Utilities     │    │   Config    │ │
│  │                 │    │                 │    │             │ │
│  │ • Messages[]    │    │ • QR Generator  │    │ • Puppeteer │ │
│  │ • Contacts[]    │    │ • Data Parser   │    │ • LocalAuth │ │
│  │ • Client Info   │    │ • Logger        │    │ • Storage   │ │
│  └─────────────────┘    └─────────────────┘    └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📱 iOS App Component Hierarchy

```
App.tsx (Root Component)
├── GestureHandlerRootView
├── StatusBar
└── NavigationContainer
    └── Stack.Navigator
        ├── ConnectionScreen
        │   ├── ConnectionModal (Overlay)
        │   ├── StatusIndicator
        │   ├── QRCodeDisplay
        │   └── RetryButton
        └── ChatScreen
            ├── Header
            │   ├── AppTitle
            │   ├── ContactName
            │   └── StatusButton
            ├── ContactSelector (Horizontal)
            │   └── ContactChip[]
            ├── MessageList
            │   └── MessageBubble[]
            │       ├── MessageText
            │       ├── Timestamp
            │       └── StatusIcon
            └── MessageComposer
                ├── TextInput
                ├── SendButton
                └── RefreshButton
```

---

## 🔄 Data Flow Architecture

### **1. App Initialization Flow**
```
App Launch
    ↓
Check WhatsApp Connection (/status)
    ↓
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   Offline   │ Connecting  │  QR Code    │   Ready     │
│             │             │             │             │
│ Show Error  │ Show Loader │ Show QR     │ Load Data   │
│ Retry Btn   │ Progress    │ Instructions│ Navigate    │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### **2. Message Loading Flow**
```
Chat Screen Load
    ↓
Fetch Contacts (/contacts)
    ↓
Fetch Messages (/messages)
    ↓
Parse & Format Data
    ↓
Update UI State
    ↓
Render Components
```

### **3. Message Sending Flow**
```
User Types Message
    ↓
Press Send Button
    ↓
Create Temp Message (Optimistic UI)
    ↓
POST /send {to, message}
    ↓
┌─────────────┬─────────────┐
│   Success   │    Error    │
│             │             │
│ Update ID   │ Remove Temp │
│ & Timestamp │ Show Error  │
└─────────────┴─────────────┘
```

---

## 🏛️ Backend Service Architecture

### **WhatsApp Service Internal Structure**

```
whatsapp-service-ios.js
├── Express Server Setup
│   ├── CORS Configuration
│   ├── JSON Body Parser
│   └── Port 3002 Binding
├── WhatsApp Client Initialization
│   ├── LocalAuth Strategy
│   ├── Puppeteer Configuration
│   └── Session Management (.wwebjs_ios/)
├── Event Handlers
│   ├── 'qr' → Generate QR Code
│   ├── 'authenticated' → Set Auth Status
│   ├── 'ready' → Load Initial Data
│   ├── 'message' → Handle New Messages
│   └── 'disconnected' → Reset Status
├── API Endpoints
│   ├── GET /status → Connection Status
│   ├── GET /contacts → Contact List
│   ├── GET /messages → Message History
│   └── POST /send → Send Message
└── Data Management
    ├── In-Memory Storage
    ├── Message Filtering
    └── Contact Processing
```

---

## 🔐 Security & Session Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Security Layer                           │
│                                                                 │
│  iOS App                Backend Service           WhatsApp Web  │
│     │                         │                         │      │
│     │ HTTP (localhost only)   │ Authenticated Session   │      │
│     │◄──────────────────────►│◄──────────────────────►│      │
│     │                         │                         │      │
│  • No Auth Required         • Session Storage         • QR Auth │
│  • Local Network Only      • .wwebjs_ios/ folder     • Cookies │
│  • CORS Enabled            • LocalAuth Strategy      • Session │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 State Management Architecture

### **iOS App State Structure**

```typescript
// App.tsx State Management
interface AppState {
  // Connection Management
  connectionStatus: 'checking' | 'connecting' | 'qr' | 'ready' | 'offline';
  
  // Data State
  messages: Message[];
  contacts: Contact[];
  selectedContactId: string | null;
  
  // UI State
  isLoadingMessages: boolean;
  isNavigationReady: boolean;
  
  // Error State
  error: string | null;
}

// Component Props Flow
App.tsx
├── connectionStatus → ConnectionScreen
├── messages + contacts → ChatScreen
├── selectedContactId → ChatScreen
└── handlers → Both Screens
```

---

## 🚀 Deployment Architecture

```
Development Environment:
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   iOS Simulator │    │   Metro Bundler │    │  WhatsApp Svc   │
│                 │    │                 │    │                 │
│ • iPhone 16+    │◄──►│ • Port 8081     │    │ • Port 3002     │
│ • React Native  │    │ • Hot Reload    │    │ • Node.js       │
│ • Debug Mode    │    │ • Source Maps   │    │ • Development   │
└─────────────────┘    └─────────────────┘    └─────────────────┘

Production Environment:
┌─────────────────┐    ┌─────────────────┐
│   iOS Device    │    │  WhatsApp Svc   │
│                 │    │                 │
│ • Native Bundle │◄──►│ • Port 3002     │
│ • Optimized     │    │ • Production    │
│ • App Store     │    │ • PM2/Forever   │
└─────────────────┘    └─────────────────┘
```

---

## 🎯 Key Architectural Decisions

### **1. Technology Choices**
- **React Native 0.74.x**: Better M3 Mac compatibility
- **React Navigation v6**: Native stack navigation
- **HTTP API**: Simple REST communication
- **Express.js**: Lightweight backend framework
- **WhatsApp Web.js**: Proven WhatsApp integration

### **2. Separation of Concerns**
- **iOS App**: UI/UX and user interaction only
- **Backend Service**: WhatsApp integration and data management
- **Clear API Contract**: RESTful endpoints with JSON

### **3. Scalability Considerations**
- **Modular Components**: Easy to extend and modify
- **Service Architecture**: Backend can serve multiple clients
- **State Management**: Centralized but not complex
- **Error Handling**: Graceful degradation and recovery

### **4. Development Workflow**
- **Incremental Development**: Build and test each layer
- **Hot Reload**: Fast development iteration
- **Separate Services**: Independent development and testing
- **Clear Documentation**: Architecture and API docs

This architecture provides a solid foundation for the iOS WhatsApp app with clear separation of concerns, scalable design, and maintainable code structure.