import { NextRequest, NextResponse } from 'next/server';
import { getWhatsAppCloudAPI } from '../../../../lib/whatsappCloudAPI';

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json();
    
    if (!to || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: to, message' },
        { status: 400 }
      );
    }

    const whatsappAPI = getWhatsAppCloudAPI();
    
    // Try Cloud API first
    if (whatsappAPI.isConfigured()) {
      console.log(`📤 Sending via WhatsApp Cloud API to ${to}: ${message}`);
      
      try {
        const result = await whatsappAPI.sendMessage(to, message);
        
        return NextResponse.json({ 
          success: true, 
          messageId: result.messages[0].id,
          mode: 'cloud_api',
          result: result
        });
      } catch (apiError) {
        console.error('❌ Cloud API send failed:', apiError);
        return NextResponse.json(
          { error: 'Failed to send via Cloud API', details: apiError },
          { status: 500 }
        );
      }
    } else {
      // Fallback to mock/integrated mode
      console.log(`📤 Sending via mock mode to ${to}: ${message}`);
      
      const { getWhatsAppServer } = require('../../../../lib/whatsappServer');
      const whatsappServer = getWhatsAppServer();
      
      const status = whatsappServer.getStatus();
      if (!status.ready) {
        return NextResponse.json(
          { error: 'WhatsApp not ready - configure Cloud API or use mock mode' },
          { status: 503 }
        );
      }

      const result = await whatsappServer.sendMessage(to, message);
      
      return NextResponse.json({ 
        success: true, 
        messageId: result.id,
        timestamp: result.timestamp,
        mode: 'mock',
        ack: result.ack
      });
    }
    
  } catch (error) {
    console.error('❌ Send message error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

/*
Real implementation:

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json();
    
    if (!client || !isReady) {
      return NextResponse.json(
        { error: 'WhatsApp client not ready' },
        { status: 503 }
      );
    }

    if (!to || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: to, message' },
        { status: 400 }
      );
    }

    const sentMessage = await client.sendMessage(to, message);
    
    return NextResponse.json({ 
      success: true, 
      messageId: sentMessage.id._serialized,
      timestamp: sentMessage.timestamp
    });
    
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
*/