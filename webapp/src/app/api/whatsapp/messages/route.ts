import { NextRequest, NextResponse } from 'next/server';
import { getWhatsAppCloudAPI } from '../../../../lib/whatsappCloudAPI';

export async function GET(request: NextRequest) {
  try {
    const whatsappAPI = getWhatsAppCloudAPI();
    
    // For WhatsApp Cloud API, return mock conversation data
    // In production, you'd store and retrieve messages from your database
    if (whatsappAPI.isConfigured()) {
      console.log('💬 Returning Cloud API mock messages');
      
      const now = Date.now() / 1000;
      const cloudMessages = [
        // Recent conversation with Mom
        {
          id: 'cloud_msg_1',
          body: 'Beta, khana kha liya?',
          from: '919876543210@c.us',
          to: '918777345990@c.us',
          timestamp: now - 1800, // 30 minutes ago
          fromMe: false,
          hasMedia: false,
          type: 'chat'
        },
        {
          id: 'cloud_msg_2',
          body: 'Haan mom, just had lunch 😊',
          from: '918777345990@c.us',
          to: '919876543210@c.us',
          timestamp: now - 1700, // 28 minutes ago
          fromMe: true,
          hasMedia: false,
          type: 'chat'
        },
        // Conversation with Priya
        {
          id: 'cloud_msg_3',
          body: 'Hey! Are you free this evening?',
          from: '919876543212@c.us',
          to: '918777345990@c.us',
          timestamp: now - 3600, // 1 hour ago
          fromMe: false,
          hasMedia: false,
          type: 'chat'
        },
        {
          id: 'cloud_msg_4',
          body: 'Yes, what\'s the plan?',
          from: '918777345990@c.us',
          to: '919876543212@c.us',
          timestamp: now - 3500, // 58 minutes ago
          fromMe: true,
          hasMedia: false,
          type: 'chat'
        },
        // Conversation with Dad
        {
          id: 'cloud_msg_5',
          body: 'Beta, ghar kab aa rahe ho?',
          from: '919876543211@c.us',
          to: '918777345990@c.us',
          timestamp: now - 7200, // 2 hours ago
          fromMe: false,
          hasMedia: false,
          type: 'chat'
        }
      ];
      
      return NextResponse.json(cloudMessages);
    } else {
      // Fallback to integrated mode
      const { getWhatsAppServer } = require('../../../../lib/whatsappServer');
      const whatsappServer = getWhatsAppServer();
      
      const status = whatsappServer.getStatus();
      if (!status.ready) {
        return NextResponse.json(
          { error: 'WhatsApp client not ready' },
          { status: 503 }
        );
      }

      const messages = whatsappServer.getMessages();
      return NextResponse.json(messages);
    }
    
  } catch (error) {
    console.error('❌ Get messages error:', error);
    return NextResponse.json(
      { error: 'Failed to get messages' },
      { status: 500 }
    );
  }
}