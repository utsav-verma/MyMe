import { Contact, Message } from '../types/chat';

export const mockContacts: Contact[] = [
  {
    id: 'contact_1',
    name: 'John Doe',
    phone: '+1234567890',
    avatar: '👨‍💼',
    lastSeen: '2 minutes ago'
  },
  {
    id: 'contact_2',
    name: 'Sarah Wilson',
    phone: '+1234567891',
    avatar: '👩‍💻',
    lastSeen: '5 minutes ago'
  },
  {
    id: 'contact_3',
    name: 'Mike Johnson',
    phone: '+1234567892',
    avatar: '👨‍🎨',
    lastSeen: '1 hour ago'
  },
  {
    id: 'contact_4',
    name: 'Emma Davis',
    phone: '+1234567893',
    avatar: '👩‍🔬',
    lastSeen: 'online'
  }
];

export const mockMessages: Message[] = [
  {
    id: 'msg_1',
    contactId: 'contact_1',
    content: 'Hey! How are you doing?',
    timestamp: new Date('2025-01-21T10:30:00'),
    isOutgoing: false,
    messageType: 'text'
  },
  {
    id: 'msg_2',
    contactId: 'contact_2',
    content: 'Can we schedule a meeting for tomorrow?',
    timestamp: new Date('2025-01-21T10:35:00'),
    isOutgoing: false,
    messageType: 'text'
  },
  {
    id: 'msg_3',
    contactId: 'contact_1',
    content: 'I\'m doing great, thanks for asking!',
    timestamp: new Date('2025-01-21T10:40:00'),
    isOutgoing: true,
    replyToContactId: 'contact_1',
    messageType: 'text'
  },
  {
    id: 'msg_4',
    contactId: 'contact_3',
    content: 'Check out this new design I made',
    timestamp: new Date('2025-01-21T10:45:00'),
    isOutgoing: false,
    messageType: 'text'
  },
  {
    id: 'msg_5',
    contactId: 'contact_2',
    content: 'Sure! How about 2 PM?',
    timestamp: new Date('2025-01-21T10:50:00'),
    isOutgoing: true,
    replyToContactId: 'contact_2',
    messageType: 'text'
  },
  {
    id: 'msg_6',
    contactId: 'contact_4',
    content: 'The project is looking amazing!',
    timestamp: new Date('2025-01-21T10:55:00'),
    isOutgoing: false,
    messageType: 'text'
  }
];