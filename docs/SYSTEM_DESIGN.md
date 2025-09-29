# MyMe WhatsApp Chat - System Design Document

## 🎯 Architecture Overview

### Current Issues Identified:
1. **Monolithic Component**: Single large UnifiedChat component handling all functionality
2. **Mixed Concerns**: Contact management, message display, and UI logic intertwined
3. **Data Inconsistency**: Multiple data sources for same information causing bugs
4. **Complex State Management**: Single state object managing all application data

## 🏗️ Proposed Component Architecture

### 1. **Core Components Separation**

```
src/components/
├── chat/
│   ├── ChatContainer.tsx          # Main chat layout
│   ├── MessageList.tsx            # Message display logic
│   ├── MessageBubble.tsx          # Individual message component
│   └── RecipientIndicator.tsx     # Recipient info display
├── contacts/
│   ├── ContactSelector.tsx        # Contact selection modal
│   ├── ContactList.tsx            # Contact list display
│   └── ContactItem.tsx            # Individual contact component
├── modals/
│   ├── ReplyModal.tsx             # Reply message modal
│   ├── NewMessageModal.tsx        # New message composition
│   └── ContactSelectionModal.tsx  # Contact picker modal
└── shared/
    ├── ProfilePicture.tsx         # Reusable profile picture component
    ├── ContactName.tsx            # Consistent contact name display
    └── MessageStatus.tsx          # Message status indicators
```

### 2. **Data Management Layer**

```
src/hooks/
├── useContacts.ts                 # Contact data management
├── useMessages.ts                 # Message data management
├── useWhatsAppConnection.ts       # WhatsApp service integration
└── useRecipientInfo.ts            # Recipient information logic

src/services/
├── contactService.ts              # Contact data operations
├── messageService.ts              # Message operations
└── whatsappAPI.ts                 # WhatsApp API abstraction
```

### 3. **State Management Structure**

```typescript
// Separate state contexts
interface ContactState {
  contacts: Contact[];
  selectedContact: Contact | null;
  searchQuery: string;
  loading: boolean;
}

interface MessageState {
  messages: Message[];
  selectedMessage: Message | null;
  replyMode: boolean;
  loading: boolean;
}

interface UIState {
  modals: {
    reply: boolean;
    contactSelection: boolean;
    newMessage: boolean;
  };
  theme: 'light' | 'dark';
}
```

## 🔧 Data Flow Design

### 1. **Contact Data Flow**
```
Backend → ContactService → useContacts → ContactComponents
```

### 2. **Message Data Flow**
```
Backend → MessageService → useMessages → MessageComponents
```

### 3. **Recipient Information Flow**
```
MessageData + ContactData → useRecipientInfo → RecipientIndicator
```

## 🎨 Component Responsibilities

### **ChatContainer.tsx**
- Layout management
- Theme handling
- Modal state coordination

### **MessageList.tsx**
- Message rendering
- Scroll management
- Date separators

### **MessageBubble.tsx**
- Individual message display
- Click handling
- Status indicators

### **RecipientIndicator.tsx**
- Recipient information display
- Profile picture handling
- Consistent formatting

### **ContactSelector.tsx**
- Contact search
- Contact filtering
- Selection handling

### **ReplyModal.tsx**
- Reply composition
- Contact display
- Message sending

## 🔄 Data Consistency Strategy

### 1. **Single Source of Truth**
```typescript
// Centralized contact resolution
const useContactResolver = () => {
  const getContactInfo = (contactId: string) => {
    // Single function for all contact info needs
    return {
      name: resolveContactName(contactId),
      avatar: resolveContactAvatar(contactId),
      profilePicUrl: resolveProfilePicture(contactId)
    };
  };
};
```

### 2. **Consistent Data Types**
```typescript
interface ContactInfo {
  id: string;
  name: string;
  displayName: string;  // Formatted for UI
  avatar: string;
  profilePicUrl?: string;
  phone: string;
  formattedPhone: string; // Formatted for display
}

interface MessageWithRecipient extends Message {
  recipientInfo?: ContactInfo;
  senderInfo?: ContactInfo;
}
```

## 🚀 Implementation Strategy

### Phase 1: **Component Extraction**
1. Extract ProfilePicture component
2. Extract ContactName component
3. Extract RecipientIndicator component

### Phase 2: **Modal Separation**
1. Separate ReplyModal
2. Separate ContactSelectionModal
3. Separate NewMessageModal

### Phase 3: **Data Layer**
1. Create contact service
2. Create message service
3. Implement consistent data resolution

### Phase 4: **State Management**
1. Separate state contexts
2. Implement custom hooks
3. Remove monolithic state

## 🔍 Benefits of New Architecture

### **Maintainability**
- Clear separation of concerns
- Easier debugging
- Isolated component testing

### **Consistency**
- Single data resolution functions
- Consistent UI components
- Unified styling approach

### **Scalability**
- Easy to add new features
- Modular component structure
- Reusable components

### **Bug Prevention**
- Isolated component logic
- Consistent data flow
- Clear component boundaries

## 🎯 Immediate Action Plan

### **Critical Fixes Needed:**
1. **Fix Reply Modal Bug**: Revert to working state
2. **Extract ProfilePicture Component**: Consistent profile picture handling
3. **Create ContactResolver Hook**: Single source for contact information
4. **Separate Modal Components**: Independent modal logic

### **Next Steps:**
1. Implement ProfilePicture component
2. Create ContactName component
3. Extract RecipientIndicator component
4. Separate modal components
5. Implement data services

This architecture will solve the current issues and provide a solid foundation for future development.