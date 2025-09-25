'use client';

import { useState, useEffect, useCallback } from 'react';
import { Contact, Message } from '../types/chat';
import { AuthState } from '../types/auth';

// Custom hook for WhatsApp integration
export const useWhatsApp = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isConnecting: false
  });
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Initialize WhatsApp connection
  const initializeWhatsApp = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isConnecting: true }));
    
    try {
      // In a real implementation, this would connect to your backend API
      // that handles the WhatsApp Web.js client
      
      const response = await fetch('/api/whatsapp/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to initialize WhatsApp');
      }
      
      // Start polling for QR code and connection status
      pollConnectionStatus();
      
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Connection failed'
      }));
    }
  }, []);

  // Poll for connection status
  const pollConnectionStatus = useCallback(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/whatsapp/status');
        const status = await response.json();
        
        if (status.qr && !authState.isAuthenticated) {
          setAuthState(prev => ({ ...prev, qrCode: status.qr }));
        }
        
        if (status.ready) {
          setAuthState(prev => ({
            ...prev,
            isAuthenticated: true,
            isConnecting: false,
            clientInfo: status.clientInfo
          }));
          
          // Load contacts and messages
          loadContacts();
          loadMessages();
          
          clearInterval(interval);
        }
        
      } catch (error) {
        console.error('Status polling error:', error);
      }
    }, 2000);

    // Clear interval after 2 minutes if not connected
    setTimeout(() => clearInterval(interval), 120000);
  }, [authState.isAuthenticated]);

  // Load contacts from WhatsApp
  const loadContacts = useCallback(async () => {
    try {
      const response = await fetch('/api/whatsapp/contacts');
      const whatsappContacts = await response.json();
      
      const formattedContacts: Contact[] = whatsappContacts.map((contact: any) => ({
        id: contact.id,
        name: contact.name || contact.pushname || contact.number,
        phone: contact.number,
        avatar: '👤', // Default avatar, could fetch actual profile pic
        lastSeen: 'Unknown'
      }));
      
      setContacts(formattedContacts);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    }
  }, []);

  // Load messages from WhatsApp
  const loadMessages = useCallback(async () => {
    try {
      const response = await fetch('/api/whatsapp/messages');
      const whatsappMessages = await response.json();
      
      const formattedMessages: Message[] = whatsappMessages.map((msg: any) => ({
        id: msg.id,
        contactId: msg.fromMe ? msg.to : msg.from,
        content: msg.body,
        timestamp: new Date(msg.timestamp * 1000),
        isOutgoing: msg.fromMe,
        messageType: 'text'
      }));
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }, []);

  // Send message through WhatsApp
  const sendMessage = useCallback(async (contactId: string, content: string) => {
    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: contactId, message: content })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      // Add message to local state immediately for better UX
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        contactId,
        content,
        timestamp: new Date(),
        isOutgoing: true,
        messageType: 'text'
      };
      
      setMessages(prev => [...prev, newMessage]);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }, []);

  // Listen for new messages via WebSocket or polling
  useEffect(() => {
    if (!authState.isAuthenticated) return;
    
    const pollMessages = setInterval(async () => {
      try {
        const response = await fetch('/api/whatsapp/messages/new');
        const newMessages = await response.json();
        
        if (newMessages.length > 0) {
          const formattedMessages: Message[] = newMessages.map((msg: any) => ({
            id: msg.id,
            contactId: msg.fromMe ? msg.to : msg.from,
            content: msg.body,
            timestamp: new Date(msg.timestamp * 1000),
            isOutgoing: msg.fromMe,
            messageType: 'text'
          }));
          
          setMessages(prev => [...prev, ...formattedMessages]);
        }
      } catch (error) {
        console.error('Failed to poll new messages:', error);
      }
    }, 3000);
    
    return () => clearInterval(pollMessages);
  }, [authState.isAuthenticated]);

  return {
    authState,
    messages,
    contacts,
    initializeWhatsApp,
    sendMessage,
    loadContacts,
    loadMessages
  };
};