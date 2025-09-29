export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  lastSeen?: string;
  profilePicUrl?: string;
}

export interface Message {
  id: string;
  contactId: string;
  content: string;
  timestamp: Date;
  isOutgoing: boolean;
  replyToContactId?: string; // Who this message is replying to
  replyToContactName?: string; // Name of contact being replied to
  messageType: 'text' | 'image' | 'audio' | 'document';
}

export interface UnifiedChatState {
  messages: Message[];
  contacts: Contact[];
  selectedContactForReply?: Contact;
  isReplyModalOpen: boolean;
}
