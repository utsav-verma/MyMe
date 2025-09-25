'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MessageCircle, Send, X, RefreshCw, Moon, Sun, Plus } from 'lucide-react';
import { Contact, Message, UnifiedChatState } from '../types/chat';

const UnifiedChat: React.FC = () => {
  const [chatState, setChatState] = useState<UnifiedChatState>({
    messages: [],
    contacts: [],
    selectedContactForReply: undefined,
    isReplyModalOpen: false
  });
  
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState({ isConnecting: true, message: 'Connecting to WhatsApp...' });
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to light mode
  const [loadingProgress, setLoadingProgress] = useState({ show: false, current: 0, total: 0, message: '' });
  const [isContactSelectionOpen, setIsContactSelectionOpen] = useState(false);
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [selectedContactForNewMessage, setSelectedContactForNewMessage] = useState<Contact | null>(null);
  const [newMessageText, setNewMessageText] = useState('');
  const [contactSearchQuery, setContactSearchQuery] = useState('');

  // Load contacts and messages on component mount
  useEffect(() => {
    loadInitialData();
    
    // Refresh contacts every 10 seconds for real-time sync
    const contactRefreshInterval = setInterval(() => {
      console.log('🔄 Refreshing contacts for real-time sync...');
      loadContacts();
    }, 10000);
    
    return () => clearInterval(contactRefreshInterval);
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    setSyncStatus({ isConnecting: true, message: 'Syncing contacts...' });
    setLoadingProgress({ show: true, current: 0, total: 100, message: 'Starting sync...' });
    
    try {
      setLoadingProgress(prev => ({ ...prev, current: 20, message: 'Loading contacts...' }));
      await loadContacts();
      
      setLoadingProgress(prev => ({ ...prev, current: 60, message: 'Loading messages...' }));
      setSyncStatus({ isConnecting: true, message: 'Loading messages...' });
      await loadMessages();
      
      setLoadingProgress(prev => ({ ...prev, current: 100, message: 'Sync complete!' }));
      setSyncStatus({ isConnecting: false, message: 'Connected' });
      
      // Hide loading bar after 1 second
      setTimeout(() => {
        setLoadingProgress(prev => ({ ...prev, show: false }));
      }, 1000);
    } catch (error) {
      console.error('Failed to load initial data:', error);
      setSyncStatus({ isConnecting: false, message: 'Connection failed' });
      setLoadingProgress(prev => ({ ...prev, show: false }));
    } finally {
      setIsLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      const response = await fetch('http://localhost:3001/contacts');
      if (response.ok) {
        const whatsappContacts = await response.json();
        console.log(`📞 Loaded ${whatsappContacts.length} contacts from backend`);
        const formattedContacts: Contact[] = whatsappContacts.map((contact: any) => ({
          id: contact.id,
          name: contact.name || contact.pushname || contact.number,
          phone: contact.number || contact.id,
          avatar: contact.profilePicUrl || '👤',
          lastSeen: 'Unknown',
          profilePicUrl: contact.profilePicUrl
        }));
        const contactsWithPics = formattedContacts.filter(c => c.profilePicUrl && c.profilePicUrl !== '👤').length;
        console.log(`✅ Processed ${formattedContacts.length} contacts (${contactsWithPics} with profile pics)`);
        setChatState(prev => ({ ...prev, contacts: formattedContacts }));
        
        // Update loading progress
        setLoadingProgress(prev => ({
          ...prev,
          current: formattedContacts.length,
          message: `Loaded ${formattedContacts.length} contacts`
        }));
      }
    } catch (error) {
      console.error('Failed to load contacts:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await fetch('http://localhost:3001/messages');
      if (response.ok) {
        const whatsappMessages = await response.json();
        console.log('Loaded messages:', whatsappMessages.length);
        
        setChatState(prev => {
          const existingMessages = prev.messages;
          const updatedMessages = whatsappMessages.map((newMsg: any) => {
            const existingMsg = existingMessages.find(existing => existing.id === newMsg.id);
            if (existingMsg && (existingMsg.replyToContactName || existingMsg.sentToContactName)) {
              return {
                ...newMsg,
                replyToContactName: existingMsg.replyToContactName,
                replyToContactId: existingMsg.replyToContactId,
                replyToContactAvatar: existingMsg.replyToContactAvatar,
                sentToContactName: existingMsg.sentToContactName,
                sentToContactId: existingMsg.sentToContactId,
                sentToContactAvatar: existingMsg.sentToContactAvatar
              };
            }
            
            // Add recipient info for sent messages that don't have it
            if (newMsg.fromMe && !newMsg.sentToContactName && !newMsg.replyToContactName) {
              const recipientId = newMsg.to;
              // Find contact in contacts array
              const contact = prev.contacts.find(c => c.id === recipientId);
              const recipientName = contact?.name || getContactName(recipientId);
              const recipientAvatar = contact?.profilePicUrl;
              console.log('Adding recipient info:', { 
                recipientId, 
                contact: contact ? { id: contact.id, name: contact.name } : null, 
                recipientName,
                contactsCount: prev.contacts.length 
              });
              return {
                ...newMsg,
                sentToContactId: recipientId,
                sentToContactName: recipientName,
                sentToContactAvatar: recipientAvatar
              };
            }
            
            // If it's a sent message but no recipient info was added, log it
            if (newMsg.fromMe && !newMsg.sentToContactName && !newMsg.replyToContactName) {
              console.log('Failed to add recipient info for:', { id: newMsg.id, to: newMsg.to, body: newMsg.body?.substring(0, 20) });
            }
            return newMsg;
          });
          
          const localMessages = existingMessages.filter(existing => 
            (existing.id.startsWith('reply_') || existing.id.startsWith('new_')) && 
            !whatsappMessages.find((serverMsg: any) => serverMsg.id === existing.id)
          );
          
          // Remove duplicates based on timestamp and body
          const allMessages = [...updatedMessages, ...localMessages];
          const uniqueMessages = allMessages.filter((msg, index, arr) => 
            index === arr.findIndex(m => 
              Math.abs(m.timestamp - msg.timestamp) < 5 && m.body === msg.body
            )
          );
          
          return { 
            ...prev, 
            messages: uniqueMessages
          };
        });
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const getContactById = (id: string): Contact | undefined => {
    return chatState.contacts.find(contact => contact.id === id);
  };

  const getContactName = (contactId: string | undefined): string => {
    if (!contactId) {
      return 'Unknown Contact';
    }
    
    const contact = getContactById(contactId);
    if (!contact) {
      if (Math.random() < 0.1) {
        console.log('❌ Contact not found:', contactId, '(Total contacts:', chatState.contacts.length, ')');
      }
    }
    
    if (contact && contact.name) {
      return contact.name;
    }
    
    const phoneNumber = contactId.includes('@') ? contactId.split('@')[0] : contactId;
    
    if (phoneNumber.match(/^\d+$/)) {
      if (phoneNumber.startsWith('91') && phoneNumber.length === 12) {
        return `+91 ${phoneNumber.slice(2, 7)} ${phoneNumber.slice(7)}`;
      }
      return `+${phoneNumber}`;
    }
    
    return contactId;
  };

  const getContactAvatar = (contactId: string | undefined): string => {
    if (!contactId) {
      return '👤';
    }
    
    const contact = getContactById(contactId);
    if (contact?.profilePicUrl) {
      return contact.profilePicUrl;
    }
    if (contact?.avatar) {
      return contact.avatar;
    }
    
    const emojis = ['👨', '👩', '👱', '👴', '👶', '👷', '👸', '👹', '👺', '👻'];
    const index = contactId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % emojis.length;
    return emojis[index];
  };

  const handleMessageClick = useCallback((message: any) => {
    if (!message.fromMe && message.from) {
      const contactId = message.from;
      const contactName = getContactName(contactId);
      const contactAvatar = getContactAvatar(contactId);
      
      const contact = {
        id: contactId,
        name: contactName,
        avatar: contactAvatar,
        phone: contactId && contactId.includes('@') ? contactId.split('@')[0] : contactId || 'Unknown',
        lastSeen: 'Active'
      };
      
      setChatState(prevState => ({
        ...prevState,
        selectedContactForReply: contact,
        isReplyModalOpen: true
      }));
    }
  }, []);

  const handleSendReply = async () => {
    if (!replyText.trim() || !chatState.selectedContactForReply) {
      return;
    }

    const replyToName = chatState.selectedContactForReply.name;
    const cleanAvatar = chatState.selectedContactForReply.profilePicUrl?.startsWith('http') 
      ? chatState.selectedContactForReply.profilePicUrl 
      : chatState.selectedContactForReply.avatar;
    
    const newMessage: any = {
      id: `reply_${Date.now()}`,
      body: replyText,
      from: 'me@c.us',
      to: chatState.selectedContactForReply.id,
      timestamp: Date.now() / 1000,
      fromMe: true,
      hasMedia: false,
      type: 'chat',
      replyToContactId: chatState.selectedContactForReply.id,
      replyToContactName: replyToName,
      replyToContactAvatar: cleanAvatar
    };

    console.log('Creating reply:', { body: replyText, replyToName, avatar: cleanAvatar });

    // Apply recipient info immediately to avoid showing URL
    const enhancedMessage = {
      ...newMessage,
      replyToContactName: replyToName,
      replyToContactId: chatState.selectedContactForReply.id,
      replyToContactAvatar: cleanAvatar
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, enhancedMessage]
    }));

    try {
      const response = await fetch('http://localhost:3001/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          to: chatState.selectedContactForReply.id, 
          message: replyText 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setChatState(prev => ({
        ...prev,
        messages: prev.messages.filter(msg => msg.id !== newMessage.id)
      }));
      alert('Failed to send message. Please try again.');
    }

    setChatState(prev => ({
      ...prev,
      isReplyModalOpen: false,
      selectedContactForReply: undefined
    }));
    
    setReplyText('');
  };

  const closeReplyModal = useCallback(() => {
    setChatState(prev => ({
      ...prev,
      isReplyModalOpen: false,
      selectedContactForReply: undefined
    }));
    setReplyText('');
  }, []);

  const handleSendNewMessage = async () => {
    if (!newMessageText.trim() || !selectedContactForNewMessage) {
      return;
    }

    const newMessage: any = {
      id: `new_${Date.now()}`,
      body: newMessageText,
      from: 'me@c.us',
      to: selectedContactForNewMessage.id,
      timestamp: Date.now() / 1000,
      fromMe: true,
      hasMedia: false,
      type: 'chat',
      sentToContactId: selectedContactForNewMessage.id,
      sentToContactName: selectedContactForNewMessage.name,
      sentToContactAvatar: selectedContactForNewMessage.profilePicUrl || getContactAvatar(selectedContactForNewMessage.id)
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));

    try {
      const response = await fetch('http://localhost:3001/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          to: selectedContactForNewMessage.id, 
          message: newMessageText 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setChatState(prev => ({
        ...prev,
        messages: prev.messages.filter(msg => msg.id !== newMessage.id)
      }));
      alert('Failed to send message. Please try again.');
    }

    setIsNewMessageModalOpen(false);
    setSelectedContactForNewMessage(null);
    setNewMessageText('');
  };

  const closeNewMessageModal = () => {
    setIsNewMessageModalOpen(false);
    setSelectedContactForNewMessage(null);
    setNewMessageText('');
  };

  const handleContactSelect = (contact: Contact) => {
    setSelectedContactForNewMessage(contact);
    setIsContactSelectionOpen(false);
    setIsNewMessageModalOpen(true);
  };

  const closeContactSelection = () => {
    setIsContactSelectionOpen(false);
    setContactSearchQuery('');
  };

  const getFrequentlyContacted = () => {
    const messageContacts = new Set();
    chatState.messages.forEach(msg => {
      if (!msg.fromMe) messageContacts.add(msg.from);
      if (msg.fromMe) messageContacts.add(msg.to);
    });
    
    return chatState.contacts.filter(contact => 
      messageContacts.has(contact.id)
    ).slice(0, 6);
  };

  const getFilteredContacts = () => {
    if (!contactSearchQuery.trim()) {
      return chatState.contacts.slice(0, 50);
    }
    
    const query = contactSearchQuery.toLowerCase();
    return chatState.contacts.filter(contact => 
      contact.name.toLowerCase().includes(query) ||
      contact.phone.includes(query)
    ).slice(0, 20);
  };

  const sortedMessages = [...chatState.messages].sort((a, b) => 
    (a.timestamp || 0) - (b.timestamp || 0)
  );

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Theme configuration
  const themeClasses = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-gray-100',
    chatBg: isDarkMode ? '#0b1426' : '#efeae2',
    headerBg: isDarkMode ? 'bg-gray-800' : 'bg-green-500',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-300',
    messageBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    myMessageBg: isDarkMode ? 'bg-green-600' : 'bg-green-500',
    hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    modalBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    inputBg: isDarkMode ? 'bg-gray-700' : 'bg-white',
    inputBorder: isDarkMode ? 'border-gray-600' : 'border-gray-300'
  };

  return (
    <div className={`flex flex-col h-screen ${themeClasses.bg} ${themeClasses.text}`}>
      {/* Loading Progress Bar */}
      {loadingProgress.show && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className={`${themeClasses.cardBg} shadow-lg border-b ${themeClasses.border}`}>
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${themeClasses.text}`}>
                  {loadingProgress.message}
                </span>
                <span className={`text-xs ${themeClasses.textSecondary}`}>
                  {Math.round((loadingProgress.current / loadingProgress.total) * 100)}%
                </span>
              </div>
              <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-full h-2`}>
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{width: `${(loadingProgress.current / loadingProgress.total) * 100}%`}}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sync Status Popup */}
      {syncStatus.isConnecting && !loadingProgress.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${themeClasses.modalBg} rounded-lg p-8 max-w-sm w-full mx-4 text-center`}>
            <div className="mb-4">
              <div className={`w-16 h-16 ${isDarkMode ? 'bg-green-900' : 'bg-green-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <MessageCircle size={32} className={`${isDarkMode ? 'text-green-400' : 'text-green-600'} animate-pulse`} />
              </div>
              <h3 className={`text-lg font-semibold ${themeClasses.text} mb-2`}>WhatsApp</h3>
              <p className={`${themeClasses.textSecondary} mb-4`}>{syncStatus.message}</p>
              <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-full h-2`}>
                <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`${themeClasses.headerBg} text-white p-4 flex items-center justify-between border-b ${themeClasses.border}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-green-600'} flex items-center justify-center`}>
            <MessageCircle size={20} className={`${isDarkMode ? 'text-green-400' : 'text-white'}`} />
          </div>
          <div>
            <h1 className="text-lg font-medium">WhatsApp</h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-green-100'}`}>{sortedMessages.length} messages</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsContactSelectionOpen(true)}
            className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-green-600'} rounded-lg transition-colors`}
            title="New Message"
          >
            <Plus size={20} />
          </button>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-green-600'} rounded-lg transition-colors`}
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={loadInitialData}
            className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-green-600'} rounded-lg transition-colors`}
            title="Refresh"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div 
        className="flex-1 overflow-y-auto p-4"
        style={{
          backgroundImage: isDarkMode 
            ? `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            : `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundColor: themeClasses.chatBg
        }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <RefreshCw size={32} className={`${themeClasses.textSecondary} mx-auto mb-2 animate-spin`} />
              <p className={themeClasses.textSecondary}>Loading messages...</p>
            </div>
          </div>
        ) : sortedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageCircle size={48} className={`${themeClasses.textSecondary} mx-auto mb-4`} />
              <p className={themeClasses.textSecondary}>No messages yet</p>
              <p className={`text-sm ${themeClasses.textSecondary}`}>Messages will appear here when you receive them</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedMessages.map((message, index) => {
              const contactId = message.fromMe ? message.to : message.from;
              const contactName = getContactName(contactId);
              const contactAvatar = getContactAvatar(contactId);
              
              const prevMessage = index > 0 ? sortedMessages[index - 1] : null;
              const showDateSeparator = !prevMessage || 
                formatDate(message.timestamp) !== formatDate(prevMessage.timestamp);
              
              return (
                <div key={message.id}>
                  {/* Date Separator */}
                  {showDateSeparator && (
                    <div className="flex justify-center my-4">
                      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} px-3 py-1 rounded-lg shadow-sm`}>
                        <span className={`text-xs ${themeClasses.textSecondary} font-medium`}>
                          {formatDate(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Message */}
                  <div className={`flex ${message.fromMe ? 'justify-end' : 'justify-start'} mb-1`}>
                    <div
                      className={`max-w-md px-3 py-2 rounded-lg cursor-pointer transition-all hover:shadow-lg ${
                        message.fromMe
                          ? `${themeClasses.myMessageBg} text-white rounded-br-sm`
                          : `${themeClasses.messageBg} ${themeClasses.text} ${themeClasses.hover} rounded-bl-sm shadow-sm border ${themeClasses.border}`
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleMessageClick(message);
                      }}
                    >
                      {/* Contact name for incoming messages */}
                      {!message.fromMe && (
                        <div className="flex items-center gap-2 mb-1">
                          {contactAvatar.startsWith('http') ? (
                            <img 
                              src={contactAvatar} 
                              alt={contactName}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-lg">{contactAvatar}</span>
                          )}
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                            {contactName}
                          </span>
                        </div>
                      )}
                      
                      {/* Recipient indicator for sent messages */}
                      {message.fromMe && (message.replyToContactName || message.sentToContactName) && (
                        <div className="flex items-center gap-2 mb-1 opacity-90">
                          {message.sentToContactAvatar && message.sentToContactAvatar.startsWith('http') ? (
                            <img 
                              src={message.sentToContactAvatar} 
                              alt={message.sentToContactName || message.replyToContactName}
                              className="w-4 h-4 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-xs">{message.sentToContactAvatar || getContactAvatar(message.sentToContactId || message.replyToContactId)}</span>
                          )}
                          <span className="text-xs">
                            {message.replyToContactName ? `↳ ${message.replyToContactName}` : `→ ${message.sentToContactName}`}
                          </span>
                        </div>
                      )}
                      
                      {/* Message content */}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.body?.replace(/https:\/\/pps\.whatsapp\.net\/[^\s\n]+/g, '').replace(/\n+/g, '\n').trim()}
                      </p>
                      
                      {/* Time and status */}
                      <div className={`flex items-center justify-end gap-1 mt-1 ${
                        message.fromMe 
                          ? (isDarkMode ? 'text-green-200' : 'text-green-100') 
                          : themeClasses.textSecondary
                      }`}>
                        <span className="text-xs">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.fromMe && (
                          <span className="text-xs">✓✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {chatState.isReplyModalOpen && chatState.selectedContactForReply && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${themeClasses.modalBg} rounded-lg p-6 w-full max-w-md`}>
            <div className="flex items-center mb-4">
              <div className="flex items-center gap-3 flex-1">
                {chatState.selectedContactForReply.avatar && chatState.selectedContactForReply.avatar.startsWith('http') ? (
                  <img 
                    src={chatState.selectedContactForReply.avatar} 
                    alt={chatState.selectedContactForReply.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">
                    {chatState.selectedContactForReply.avatar || '👤'}
                  </span>
                )}
                <div>
                  <h3 className={`font-semibold ${themeClasses.text} text-lg`}>
                    {chatState.selectedContactForReply.name || 'Unknown Contact'}
                  </h3>
                  <p className={`text-sm ${themeClasses.textSecondary}`}>{chatState.selectedContactForReply.lastSeen}</p>
                </div>
              </div>
              <button
                onClick={closeReplyModal}
                className={`${themeClasses.textSecondary} hover:${themeClasses.text} ml-4`}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-3">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                className={`w-full p-3 border ${themeClasses.inputBorder} rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 ${themeClasses.text} placeholder-gray-400 ${themeClasses.inputBg}`}
                rows={3}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendReply();
                  }
                }}
              />
              
              <div className="flex gap-2">
                <button
                  onClick={closeReplyModal}
                  className={`flex-1 py-2 px-4 border ${themeClasses.inputBorder} rounded-lg ${themeClasses.hover} ${themeClasses.text}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Selection Modal */}
      {isContactSelectionOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${themeClasses.modalBg} rounded-lg w-full max-w-md max-h-[80vh] flex flex-col`}>
            <div className="p-4 border-b ${themeClasses.border}">
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-lg font-semibold ${themeClasses.text}`}>New chat</h3>
                <button
                  onClick={closeContactSelection}
                  className={`${themeClasses.textSecondary} hover:${themeClasses.text}`}
                >
                  <X size={20} />
                </button>
              </div>
              <input
                type="text"
                value={contactSearchQuery}
                onChange={(e) => setContactSearchQuery(e.target.value)}
                placeholder="Search name or number"
                className={`w-full p-3 border ${themeClasses.inputBorder} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${themeClasses.text} placeholder-gray-400 ${themeClasses.inputBg}`}
                autoFocus
              />
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {!contactSearchQuery && (
                <div className="p-4">
                  <h4 className={`text-sm font-medium ${themeClasses.textSecondary} mb-3`}>Frequently contacted</h4>
                  <div className="space-y-2">
                    {getFrequentlyContacted().map((contact) => (
                      <div
                        key={contact.id}
                        onClick={() => handleContactSelect(contact)}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${themeClasses.hover} transition-colors`}
                      >
                        {contact.profilePicUrl ? (
                          <img 
                            src={contact.profilePicUrl} 
                            alt={contact.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} flex items-center justify-center`}>
                            <span className="text-lg">{getContactAvatar(contact.id)}</span>
                          </div>
                        )}
                        <div className="flex-1">
                          <p className={`font-medium ${themeClasses.text}`}>{contact.name}</p>
                          <p className={`text-sm ${themeClasses.textSecondary}`}>{getContactName(contact.id)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="p-4">
                <h4 className={`text-sm font-medium ${themeClasses.textSecondary} mb-3`}>
                  {contactSearchQuery ? 'Search results' : 'Contacts on WhatsApp'}
                </h4>
                <div className="space-y-1">
                  {getFilteredContacts().map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => handleContactSelect(contact)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${themeClasses.hover} transition-colors`}
                    >
                      {contact.profilePicUrl ? (
                        <img 
                          src={contact.profilePicUrl} 
                          alt={contact.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} flex items-center justify-center`}>
                          <span className="text-lg">{getContactAvatar(contact.id)}</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className={`font-medium ${themeClasses.text}`}>{contact.name}</p>
                        <p className={`text-sm ${themeClasses.textSecondary}`}>{getContactName(contact.id)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Message Modal */}
      {isNewMessageModalOpen && selectedContactForNewMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${themeClasses.modalBg} rounded-lg p-6 w-full max-w-md`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${themeClasses.text}`}>New Message</h3>
              <button
                onClick={closeNewMessageModal}
                className={`${themeClasses.textSecondary} hover:${themeClasses.text}`}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg ${themeClasses.inputBg} border ${themeClasses.inputBorder}">
                {selectedContactForNewMessage.profilePicUrl ? (
                  <img 
                    src={selectedContactForNewMessage.profilePicUrl} 
                    alt={selectedContactForNewMessage.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} flex items-center justify-center`}>
                    <span className="text-lg">{getContactAvatar(selectedContactForNewMessage.id)}</span>
                  </div>
                )}
                <div>
                  <p className={`font-medium ${themeClasses.text}`}>{selectedContactForNewMessage.name}</p>
                  <p className={`text-sm ${themeClasses.textSecondary}`}>{getContactName(selectedContactForNewMessage.id)}</p>
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                  Message
                </label>
                <textarea
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className={`w-full p-3 border ${themeClasses.inputBorder} rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 ${themeClasses.text} placeholder-gray-400 ${themeClasses.inputBg}`}
                  rows={3}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendNewMessage();
                    }
                  }}
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={closeNewMessageModal}
                  className={`flex-1 py-2 px-4 border ${themeClasses.inputBorder} rounded-lg ${themeClasses.hover} ${themeClasses.text}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendNewMessage}
                  disabled={!newMessageText.trim()}
                  className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedChat;