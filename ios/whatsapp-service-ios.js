#!/usr/bin/env node

/**
 * Standalone WhatsApp Service
 * Runs WhatsApp Web.js in a separate Node.js process
 * Communicates with Next.js app via HTTP API
 */

const { Client, LocalAuth } = require('whatsapp-web.js');
const QRCode = require('qrcode');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let client = null;
let isReady = false;
let qrCode = null;
let isAuthenticated = false;
let clientInfo = null;
let contacts = [];
let messages = [];

console.log('🚀 Starting standalone WhatsApp service...');
console.log('📡 Service will run on http://localhost:3001');

// Initialize WhatsApp client
async function initializeWhatsApp() {
  try {
    console.log('📱 Creating WhatsApp client...');
    
    client = new Client({
      authStrategy: new LocalAuth({
        clientId: 'unified-whatsapp-service',
        dataPath: path.join(process.cwd(), '.wwebjs_service')
      }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-web-security'
        ],
        timeout: 60000
      }
    });

    // Event handlers
    client.on('qr', async (qr) => {
      try {
        console.log('🎯 QR Code received!');
        qrCode = await QRCode.toDataURL(qr, {
          errorCorrectionLevel: 'M',
          type: 'image/png',
          quality: 0.92,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        console.log('✅ QR Code generated, length:', qrCode.length);
      } catch (error) {
        console.error('❌ QR Code generation failed:', error);
        qrCode = qr; // Fallback to raw string
      }
    });

    client.on('authenticated', () => {
      isAuthenticated = true;
      qrCode = null;
      console.log('✅ WhatsApp authenticated!');
    });

    client.on('ready', async () => {
      isReady = true;
      isAuthenticated = true;
      clientInfo = client.info;
      console.log('🎉 WhatsApp client ready!', clientInfo);
      
      // Load contacts and messages
      await loadContactsAndMessages();
    });

    client.on('auth_failure', (msg) => {
      console.error('❌ Authentication failed:', msg);
      isAuthenticated = false;
      qrCode = null;
    });

    client.on('disconnected', (reason) => {
      console.log('❌ Disconnected:', reason);
      isReady = false;
      isAuthenticated = false;
      qrCode = null;
    });

    client.on('message', (message) => {
      if (message.from !== 'status@broadcast' && !message.isGroupMsg) {
        const formattedMessage = {
          id: message.id._serialized,
          body: message.body,
          from: message.from,
          to: message.to,
          timestamp: message.timestamp,
          fromMe: message.fromMe,
          hasMedia: message.hasMedia,
          type: message.type
        };
        
        messages.push(formattedMessage);
        
        // Keep only last 1000 messages
        if (messages.length > 1000) {
          messages = messages.slice(-1000);
        }
        
        console.log('📨 New message:', message.fromMe ? 'outgoing' : 'incoming');
      }
    });

    console.log('🔄 Initializing WhatsApp client...');
    await client.initialize();
    
  } catch (error) {
    console.error('❌ WhatsApp initialization failed:', error);
  }
}

async function loadContactsAndMessages() {
  try {
    console.log('💬 Loading recent messages first...');
    const chats = await client.getChats();
    console.log(`📋 Found ${chats.length} total chats`);
    const recentChats = chats
      .filter(chat => !chat.isGroup)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
    console.log(`📱 Found ${recentChats.length} individual chats`);

    messages = [];
    console.log('💬 Loading messages from chats...');
    for (const chat of recentChats) {
      try {
        console.log(`💬 Loading messages from chat: ${chat.name || 'Unknown'}`);
        const chatMessages = await chat.fetchMessages({ limit: 20 });
        chatMessages.forEach(message => {
          if (message.from !== 'status@broadcast' && !message.isGroupMsg) {
            messages.push({
              id: message.id._serialized,
              body: message.body,
              from: message.from,
              to: message.to,
              timestamp: message.timestamp,
              fromMe: message.fromMe,
              hasMedia: message.hasMedia,
              type: message.type
            });
          }
        });
      } catch (error) {
        console.error(`Failed to load messages from chat:`, error.message);
      }
    }
    
    console.log('📇 Loading contacts based on message participants...');
    const whatsappContacts = await client.getContacts();
    
    // Now create message contacts set from loaded messages
    const messageContacts = new Set();
    messages.forEach(msg => {
      messageContacts.add(msg.from);
      messageContacts.add(msg.to);
    });
    
    // Filter and sort contacts: personal contacts first, exclude business/bots
    const sortedContacts = whatsappContacts
      .filter(contact => {
        if (contact.isGroup) return false;
        // Exclude business accounts and bots
        if (contact.isBusiness || contact.isEnterprise) return false;
        if (contact.name && (contact.name.toLowerCase().includes('bot') || 
                           contact.name.toLowerCase().includes('ai') ||
                           contact.name.toLowerCase().includes('support') ||
                           contact.name.toLowerCase().includes('info'))) return false;
        return true;
      })
      .sort((a, b) => {
        const aHasMessages = messageContacts.has(a.id._serialized);
        const bHasMessages = messageContacts.has(b.id._serialized);
        const aHasName = a.name && a.name !== a.number && a.name !== a.pushname;
        const bHasName = b.name && b.name !== b.number && b.name !== b.pushname;
        
        // Priority: 1. Message participants, 2. Saved personal contacts, 3. Others
        if (aHasMessages && !bHasMessages) return -1;
        if (!aHasMessages && bHasMessages) return 1;
        if (aHasName && !bHasName) return -1;
        if (!aHasName && bHasName) return 1;
        return 0;
      });
    
    contacts = sortedContacts.map((contact) => {
      return {
        id: contact.id._serialized,
        name: contact.name || contact.pushname || contact.number,
        pushname: contact.pushname,
        number: contact.number,
        isGroup: contact.isGroup,
        profilePicUrl: null
      };
    });
    
    console.log(`✅ Loaded ${contacts.length} contacts (prioritized message participants)`);
    console.log('📱 Message participant contacts:', Array.from(messageContacts).slice(0, 5));
    console.log('🔍 First 5 loaded contact IDs:', contacts.map(c => c.id).slice(0, 5));
    console.log('🔍 Looking for Pratek in loaded contacts:', contacts.find(c => c.id.includes('919873124331') || c.name === 'Pratek'));
    console.log('🔍 All contact names:', contacts.map(c => `${c.id} = ${c.name}`).slice(0, 10));
    
    // Load profile pictures in background for first 50 contacts
    setTimeout(async () => {
      console.log('🖼️ Loading profile pictures...');
      for (let i = 0; i < Math.min(50, contacts.length); i++) {
        try {
          const contact = whatsappContacts.find(c => c.id._serialized === contacts[i].id);
          if (contact) {
            const profilePicUrl = await contact.getProfilePicUrl();
            contacts[i].profilePicUrl = profilePicUrl;
            console.log(`🖼️ Loaded profile pic for ${contacts[i].name}`);
          }
        } catch (error) {
          // No profile pic available - could be business contact
          console.log(`⚠️ No profile pic for ${contacts[i].name}`);
        }
      }
      console.log('✅ Profile pictures loaded for top 50 contacts');
    }, 2000);
    console.log(`✅ Loaded ${contacts.length} contacts`);

    const sentMessages = messages.filter(m => m.fromMe);
    console.log(`✅ Loaded ${messages.length} messages (${sentMessages.length} sent by you) from ${recentChats.length} chats`);
    
  } catch (error) {
    console.error('❌ Failed to load contacts and messages:', error);
  }
}

// API Routes
app.get('/status', (req, res) => {
  res.json({
    ready: isReady,
    authenticated: isAuthenticated,
    qr: qrCode,
    clientInfo: clientInfo
  });
});

app.get('/contacts', (req, res) => {
  res.json(contacts);
});

app.get('/sync-progress', (req, res) => {
  res.json({
    contactsLoaded: contacts.length,
    messagesLoaded: messages.length,
    isLoading: !isReady,
    status: isReady ? 'ready' : 'loading'
  });
});

app.get('/messages', (req, res) => {
  // Filter and return recent messages
  const filteredMessages = messages.filter(message => 
    message.from !== 'status@broadcast' && 
    !message.from.includes('@g.us') &&
    message.body && message.body.trim() !== ''
  );
  
  // Group by contact and get 5 most recent chats
  const messagesByContact = {};
  filteredMessages.forEach(message => {
    const contactId = message.fromMe ? message.to : message.from;
    if (!messagesByContact[contactId]) {
      messagesByContact[contactId] = [];
    }
    messagesByContact[contactId].push(message);
  });
  
  const recentChats = Object.entries(messagesByContact)
    .map(([contactId, msgs]) => ({
      contactId,
      messages: msgs.sort((a, b) => b.timestamp - a.timestamp),
      latestTimestamp: Math.max(...msgs.map(m => m.timestamp))
    }))
    .sort((a, b) => b.latestTimestamp - a.latestTimestamp)
    .slice(0, 5);
  
  const recentMessages = recentChats
    .flatMap(chat => chat.messages.slice(0, 4))
    .sort((a, b) => a.timestamp - b.timestamp);
  
  res.json(recentMessages);
});

app.post('/send', async (req, res) => {
  try {
    const { to, message } = req.body;
    
    if (!isReady) {
      return res.status(400).json({ error: 'WhatsApp client not ready' });
    }
    
    const sentMessage = await client.sendMessage(to, message);
    
    // Store the sent message in our messages array
    const formattedSentMessage = {
      id: sentMessage.id._serialized,
      body: message,
      from: clientInfo.wid._serialized,
      to: to,
      timestamp: sentMessage.timestamp,
      fromMe: true,
      hasMedia: false,
      type: 'chat'
    };
    
    messages.push(formattedSentMessage);
    console.log('📤 Stored sent message:', message.substring(0, 30) + '...');
    
    // Keep only last 1000 messages
    if (messages.length > 1000) {
      messages = messages.slice(-1000);
    }
    
    res.json({
      id: sentMessage.id._serialized,
      timestamp: sentMessage.timestamp,
      ack: sentMessage.ack
    });
    
  } catch (error) {
    console.error('❌ Failed to send message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Start the service
app.listen(PORT, () => {
  console.log(`✅ WhatsApp service running on http://localhost:${PORT}`);
  console.log('🔄 Starting WhatsApp initialization...');
  initializeWhatsApp();
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down WhatsApp service...');
  if (client) {
    await client.destroy();
  }
  process.exit(0);
});