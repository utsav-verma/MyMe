import { NextRequest, NextResponse } from 'next/server';

import { getWhatsAppCloudAPI } from '../../../../lib/whatsappCloudAPI';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 API: Initializing WhatsApp Cloud API...');
    
    const whatsappAPI = getWhatsAppCloudAPI();
    
    // Check if Cloud API is configured
    if (whatsappAPI.isConfigured()) {
      console.log('✅ WhatsApp Cloud API configured');
      
      // Test the API by getting business profile
      try {
        const profile = await whatsappAPI.getBusinessProfile();
        console.log('✅ WhatsApp Cloud API connection verified');
        
        return NextResponse.json({
          success: true,
          message: 'WhatsApp Cloud API ready',
          status: 'ready',
          mode: 'cloud_api',
          profile: profile
        });
      } catch (apiError) {
        console.error('❌ WhatsApp Cloud API test failed:', apiError);
        return NextResponse.json({
          success: false,
          error: 'WhatsApp Cloud API configuration error',
          details: 'Check your credentials in .env.local',
          mode: 'cloud_api'
        }, { status: 400 });
      }
    } else {
      console.log('⚠️ WhatsApp Cloud API not configured, using mock mode');
      
      // Fallback to mock mode
      const { getWhatsAppServer } = require('../../../../lib/whatsappServer');
      const whatsappServer = getWhatsAppServer();
      whatsappServer.initializeEnhancedMockMode();
      
      return NextResponse.json({
        success: true,
        message: 'Using mock mode - configure WhatsApp Cloud API for production',
        status: 'ready',
        mode: 'mock',
        setup_required: true
      });
    }
    
  } catch (error) {
    console.error('❌ API: WhatsApp initialization error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to initialize WhatsApp',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/*
Real implementation would look like this:

import { Client, LocalAuth } from 'whatsapp-web.js';

let client: Client | null = null;
let qrCode: string | null = null;
let isReady = false;

export async function POST(request: NextRequest) {
  try {
    if (client) {
      return NextResponse.json({ 
        success: true, 
        message: 'Client already initialized' 
      });
    }

    client = new Client({
      authStrategy: new LocalAuth({
        clientId: "unified-chat"
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
          '--single-process',
          '--disable-gpu'
        ]
      }
    });

    client.on('qr', (qr) => {
      qrCode = qr;
      console.log('QR Code generated');
    });

    client.on('ready', () => {
      isReady = true;
      console.log('WhatsApp client is ready!');
    });

    client.on('authenticated', () => {
      console.log('WhatsApp client authenticated');
    });

    client.on('auth_failure', (msg) => {
      console.error('Authentication failed:', msg);
    });

    await client.initialize();
    
    return NextResponse.json({ 
      success: true, 
      message: 'WhatsApp client initialized' 
    });
    
  } catch (error) {
    console.error('WhatsApp initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize WhatsApp client' },
      { status: 500 }
    );
  }
}
*/