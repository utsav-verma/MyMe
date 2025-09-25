// Production WhatsApp Web.js client - Server-side only
// Note: This file should only be imported in API routes, not client components

interface WhatsAppClientState {
  client: any | null;
  isReady: boolean;
  qrCode: string | null;
  isAuthenticated: boolean;
  clientInfo: any;
}

class WhatsAppClientManager {
  private state: WhatsAppClientState = {
    client: null,
    isReady: false,
    qrCode: null,
    isAuthenticated: false,
    clientInfo: null
  };

  private messageHandlers: ((message: any) => void)[] = [];
  private qrHandlers: ((qr: string) => void)[] = [];
  private readyHandlers: (() => void)[] = [];
  private authHandlers: (() => void)[] = [];

  async initialize(): Promise<void> {
    if (this.state.client) {
      console.log('Client already initialized');
      return;
    }

    try {
      // Dynamic import to avoid bundling issues
      const { Client, LocalAuth } = await import('whatsapp-web.js');
      const QRCode = await import('qrcode');
      
      this.state.client = new Client({
        authStrategy: new LocalAuth({
          clientId: 'unified-whatsapp-chat'
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
            '--disable-gpu',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
          ]
        }
      });

      this.setupEventHandlers(QRCode.default);
      await this.state.client.initialize();
      
    } catch (error) {
      console.error('Failed to initialize WhatsApp client:', error);
      throw error;
    }
  }

  private setupEventHandlers(QRCode: any): void {
    if (!this.state.client) return;

    // QR Code event
    this.state.client.on('qr', async (qr: string) => {
      try {
        this.state.qrCode = await QRCode.toDataURL(qr);
        console.log('QR Code generated');
        this.qrHandlers.forEach(handler => handler(this.state.qrCode!));
      } catch (error) {
        console.error('Failed to generate QR code:', error);
      }
    });

    // Ready event
    this.state.client.on('ready', async () => {
      this.state.isReady = true;
      this.state.isAuthenticated = true;
      this.state.clientInfo = this.state.client!.info;
      console.log('WhatsApp client is ready!', this.state.clientInfo);
      this.readyHandlers.forEach(handler => handler());
    });

    // Authenticated event
    this.state.client.on('authenticated', () => {
      this.state.isAuthenticated = true;
      console.log('WhatsApp client authenticated');
      this.authHandlers.forEach(handler => handler());
    });

    // Authentication failure
    this.state.client.on('auth_failure', (msg: string) => {
      console.error('Authentication failed:', msg);
      this.state.isAuthenticated = false;
    });

    // Disconnected event
    this.state.client.on('disconnected', (reason: string) => {
      console.log('WhatsApp client disconnected:', reason);
      this.state.isReady = false;
      this.state.isAuthenticated = false;
    });

    // Message event
    this.state.client.on('message', (message: any) => {
      const formattedMessage = {
        id: message.id._serialized,
        body: message.body,
        from: message.from,
        to: message.to,
        timestamp: message.timestamp,
        fromMe: message.fromMe,
        hasMedia: message.hasMedia,
        type: message.type,
        contact: message.getContact(),
        chat: message.getChat()
      };
      
      this.messageHandlers.forEach(handler => handler(formattedMessage));
    });
  }

  async sendMessage(to: string, message: string): Promise<any> {
    if (!this.state.isReady || !this.state.client) {
      throw new Error('WhatsApp client is not ready');
    }

    try {
      const sentMessage = await this.state.client.sendMessage(to, message);
      return {
        id: sentMessage.id._serialized,
        timestamp: sentMessage.timestamp,
        ack: sentMessage.ack
      };
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  async getContacts(): Promise<any[]> {
    if (!this.state.isReady || !this.state.client) {
      throw new Error('WhatsApp client is not ready');
    }

    try {
      const contacts = await this.state.client.getContacts();
      return contacts
        .filter(contact => !contact.isGroup && contact.isMyContact)
        .map(contact => ({
          id: contact.id._serialized,
          name: contact.name || contact.pushname,
          pushname: contact.pushname,
          number: contact.number,
          isGroup: contact.isGroup,
          profilePicUrl: null // Will be fetched separately if needed
        }));
    } catch (error) {
      console.error('Failed to get contacts:', error);
      throw error;
    }
  }

  async getChats(): Promise<any[]> {
    if (!this.state.isReady || !this.state.client) {
      throw new Error('WhatsApp client is not ready');
    }

    try {
      const chats = await this.state.client.getChats();
      return chats
        .filter(chat => !chat.isGroup)
        .map(chat => ({
          id: chat.id._serialized,
          name: chat.name,
          lastMessage: chat.lastMessage,
          unreadCount: chat.unreadCount,
          timestamp: chat.timestamp
        }));
    } catch (error) {
      console.error('Failed to get chats:', error);
      throw error;
    }
  }

  // Event handlers
  onMessage(handler: (message: any) => void): void {
    this.messageHandlers.push(handler);
  }

  onQR(handler: (qr: string) => void): void {
    this.qrHandlers.push(handler);
  }

  onReady(handler: () => void): void {
    this.readyHandlers.push(handler);
  }

  onAuth(handler: () => void): void {
    this.authHandlers.push(handler);
  }

  // Getters
  getState(): WhatsAppClientState {
    return { ...this.state };
  }

  isClientReady(): boolean {
    return this.state.isReady;
  }

  isClientAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }

  getQRCode(): string | null {
    return this.state.qrCode;
  }

  getClientInfo(): any {
    return this.state.clientInfo;
  }

  async destroy(): Promise<void> {
    if (this.state.client) {
      await this.state.client.destroy();
      this.state.client = null;
      this.state.isReady = false;
      this.state.isAuthenticated = false;
      this.state.qrCode = null;
      this.state.clientInfo = null;
    }
  }
}

// Singleton instance
export const whatsappClient = new WhatsAppClientManager();