import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { getWhatsAppServer } = require('../../../../lib/whatsappServer');
    const whatsappServer = getWhatsAppServer();
    
    const status = whatsappServer.getStatus();
    console.log('📊 Status check:', {
      ready: status.ready,
      authenticated: status.authenticated,
      hasQR: !!status.qr,
      qrLength: status.qr ? status.qr.length : 0,
      clientInfo: status.clientInfo
    });
    
    return NextResponse.json(status);
    
  } catch (error) {
    console.error('❌ Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    );
  }
}

/*
Real implementation would look like this:

export async function GET(request: NextRequest) {
  try {
    // Check if client exists and get its status
    if (!client) {
      return NextResponse.json({
        ready: false,
        authenticated: false,
        error: 'Client not initialized'
      });
    }

    const status = {
      ready: isReady,
      authenticated: client.authStrategy?.authenticated || false,
      qr: qrCode,
      clientInfo: isReady ? await client.getState() : null
    };

    return NextResponse.json(status);
    
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    );
  }
}
*/