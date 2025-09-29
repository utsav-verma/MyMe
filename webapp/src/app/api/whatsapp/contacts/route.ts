import { NextRequest, NextResponse } from 'next/server';
import { getWhatsAppCloudAPI } from '../../../../lib/whatsappCloudAPI';

export async function GET(request: NextRequest) {
  try {
    const whatsappAPI = getWhatsAppCloudAPI();
    
    // For WhatsApp Cloud API, we'll return mock contacts since Cloud API doesn't provide contact lists
    // In production, you'd typically have your own contact database
    if (whatsappAPI.isConfigured()) {
      console.log('📇 Returning Cloud API mock contacts');
      
      // Return realistic contacts for Cloud API mode
      const cloudContacts = [
        {
          id: '918777345990@c.us', // Your own number for testing
          name: 'Test Contact (You)',
          pushname: 'You',
          number: '+918777345990',
          isGroup: false,
          profilePicUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        },
        {
          id: '919876543210@c.us',
          name: 'Mom',
          pushname: 'Mom',
          number: '+919876543210',
          isGroup: false,
          profilePicUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
        },
        {
          id: '919876543211@c.us',
          name: 'Dad',
          pushname: 'Dad',
          number: '+919876543211',
          isGroup: false,
          profilePicUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        },
        {
          id: '919876543212@c.us',
          name: 'Priya',
          pushname: 'Priya',
          number: '+919876543212',
          isGroup: false,
          profilePicUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
        }
      ];
      
      return NextResponse.json(cloudContacts);
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

      const contacts = whatsappServer.getContacts();
      return NextResponse.json(contacts);
    }
    
  } catch (error) {
    console.error('❌ Get contacts error:', error);
    return NextResponse.json(
      { error: 'Failed to get contacts' },
      { status: 500 }
    );
  }
}