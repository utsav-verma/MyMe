export interface AuthState {
  isAuthenticated: boolean;
  isConnecting: boolean;
  qrCode?: string;
  error?: string;
  clientInfo?: {
    pushname: string;
    wid: string;
  };
}

export interface WhatsAppClient {
  isReady: boolean;
  qr?: string;
  authenticated?: boolean;
  error?: string;
}