import { NextRequest, NextResponse } from 'next/server';

// Webhook verification (GET request)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');
  
  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
  
  console.log('🔍 Webhook verification request:', { mode, token, challenge });
  
  if (mode === 'subscribe' && token === verifyToken) {
    console.log('✅ Webhook verified successfully');
    return new NextResponse(challenge, { status: 200 });
  } else {
    console.error('❌ Webhook verification failed');
    return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
  }
}

// Webhook for receiving messages (POST request)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📨 Received webhook:', JSON.stringify(body, null, 2));
    
    // Process incoming messages
    if (body.entry && body.entry[0] && body.entry[0].changes) {
      const changes = body.entry[0].changes;
      
      for (const change of changes) {
        if (change.value && change.value.messages) {
          const messages = change.value.messages;
          
          for (const message of messages) {
            console.log('📩 New message received:', {
              id: message.id,
              from: message.from,
              text: message.text?.body,
              timestamp: message.timestamp
            });
            
            // Here you can:
            // 1. Store the message in your database
            // 2. Send auto-replies
            // 3. Trigger notifications
            // 4. Update your UI in real-time
            
            // Example auto-reply (optional)
            if (message.text?.body.toLowerCase().includes('hello')) {
              // You could send an auto-reply here
              console.log('👋 Could send auto-reply for greeting');
            }
          }
        }
      }
    }
    
    // Always return 200 OK to acknowledge receipt
    return NextResponse.json({ status: 'ok' }, { status: 200 });
    
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}