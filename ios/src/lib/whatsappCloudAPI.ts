// WhatsApp Cloud API Service
// Official WhatsApp API - works perfectly with Next.js

interface WhatsAppMessage {
  id: string;
  from: string;
  timestamp: string;
  text?: {
    body: string;
  };
  type: 'text' | 'image' | 'document' | 'audio' | 'video';
}

interface WhatsAppContact {
  wa_id: string;
  profile: {
    name: string;
  };
}

class WhatsAppCloudAPI {
  private phoneNumberId: string;
  private accessToken: string;
  private apiVersion: string;
  private baseUrl: string;

  constructor() {
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
    this.apiVersion = process.env.WHATSAPP_API_VERSION || 'v18.0';
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
    
    if (!this.phoneNumberId || !this.accessToken) {
      console.warn('⚠️ WhatsApp Cloud API credentials not configured');
    }
  }

  // Send a text message
  async sendMessage(to: string, message: string): Promise<any> {
    try {
      console.log(`📤 Sending WhatsApp message to ${to}: ${message}`);
      
      const response = await fetch(`${this.baseUrl}/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to,
          text: { body: message }
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`WhatsApp API error: ${response.status} - ${error}`);
      }

      const result = await response.json();
      console.log('✅ Message sent successfully:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Failed to send WhatsApp message:', error);
      throw error;
    }
  }

  // Get business profile info
  async getBusinessProfile(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.phoneNumberId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get business profile: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get business profile:', error);
      throw error;
    }
  }

  // Mark message as read
  async markAsRead(messageId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId
        })
      });

      return await response.json();
    } catch (error) {
      console.error('❌ Failed to mark message as read:', error);
      throw error;
    }
  }

  // Check if API is configured with real credentials
  isConfigured(): boolean {
    return !!(this.phoneNumberId && 
             this.accessToken && 
             this.phoneNumberId !== 'demo_phone_number_id' && 
             this.accessToken !== 'demo_access_token' &&
             this.phoneNumberId.length > 10); // Real phone number IDs are long
  }

  // Get configuration status
  getStatus() {
    return {
      configured: this.isConfigured(),
      phoneNumberId: this.phoneNumberId ? '***' + this.phoneNumberId.slice(-4) : null,
      hasAccessToken: !!this.accessToken,
      apiVersion: this.apiVersion
    };
  }
}

// Singleton instance
let whatsappAPI: WhatsAppCloudAPI | null = null;

export function getWhatsAppCloudAPI(): WhatsAppCloudAPI {
  if (!whatsappAPI) {
    whatsappAPI = new WhatsAppCloudAPI();
  }
  return whatsappAPI;
}

export type { WhatsAppMessage, WhatsAppContact };