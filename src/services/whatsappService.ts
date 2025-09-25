// WhatsApp Web.js integration service
// This would run on the backend/server side

export interface WhatsAppMessage {
  id: string;
  body: string;
  from: string;
  to: string;
  timestamp: number;
  fromMe: boolean;
  hasMedia: boolean;
  type: string;
}

export interface WhatsAppContact {
  id: string;
  name?: string;
  pushname?: string;
  number: string;
  isGroup: boolean;
  profilePicUrl?: string;
}

export class WhatsAppService {
  private client: any = null;
  private isReady: boolean = false;
  private messageHandlers: ((message: WhatsAppMessage) => void)[] = [];
  private qrHandlers: ((qr: string) => void)[] = [];
  private readyHandlers: (() => void)[] = [];

  constructor() {
    // In a real implementation, this would initialize whatsapp-web.js
    // const { Client, LocalAuth } = require('whatsapp-web.js');
    // this.client = new Client({
    //   authStrategy: new LocalAuth()
    // });
    // this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.client) return;

    // QR Code event
    this.client.on('qr', (qr: string) => {
      this.qrHandlers.forEach(handler => handler(qr));
    });

    // Ready event
    this.client.on('ready', () => {
      this.isReady = true;
      this.readyHandlers.forEach(handler => handler());
    });

    // Message event
    this.client.on('message', (message: any) => {
      const whatsappMessage: WhatsAppMessage = {
        id: message.id._serialized,
        body: message.body,
        from: message.from,
        to: message.to,
        timestamp: message.timestamp,
        fromMe: message.fromMe,
        hasMedia: message.hasMedia,
        type: message.type
      };
      
      this.messageHandlers.forEach(handler => handler(whatsappMessage));
    });
  }

  async initialize(): Promise<void> {
    if (!this.client) return;
    
    try {
      await this.client.initialize();
    } catch (error) {
      console.error('Failed to initialize WhatsApp client:', error);
      throw error;
    }
  }

  async sendMessage(to: string, message: string): Promise<void> {
    if (!this.isReady || !this.client) {
      throw new Error('WhatsApp client is not ready');
    }

    try {
      await this.client.sendMessage(to, message);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  async getContacts(): Promise<WhatsAppContact[]> {
    if (!this.isReady || !this.client) {
      throw new Error('WhatsApp client is not ready');
    }

    try {
      const contacts = await this.client.getContacts();
      return contacts.map((contact: any) => ({
        id: contact.id._serialized,
        name: contact.name,
        pushname: contact.pushname,
        number: contact.number,
        isGroup: contact.isGroup,
        profilePicUrl: contact.profilePicUrl
      }));
    } catch (error) {
      console.error('Failed to get contacts:', error);
      throw error;
    }
  }

  onMessage(handler: (message: WhatsAppMessage) => void): void {
    this.messageHandlers.push(handler);
  }

  onQR(handler: (qr: string) => void): void {
    this.qrHandlers.push(handler);
  }

  onReady(handler: () => void): void {
    this.readyHandlers.push(handler);
  }

  getClientInfo() {
    if (!this.isReady || !this.client) return null;
    return this.client.info;
  }

  isClientReady(): boolean {
    return this.isReady;
  }
}

// Singleton instance
export const whatsappService = new WhatsAppService();