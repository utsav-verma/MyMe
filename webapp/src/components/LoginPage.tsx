'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, Loader2, Smartphone, Wifi } from 'lucide-react';
import { AuthState } from '../types/auth';

interface LoginPageProps {
  onAuthenticated: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onAuthenticated }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isConnecting: false
  });

  // Check status on component mount
  useEffect(() => {
    checkInitialStatus();
  }, []);

  const checkInitialStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/status');
      const status = await response.json();
      
      if (status.ready && status.authenticated) {
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: true,
          clientInfo: status.clientInfo
        }));
        onAuthenticated();
      }
    } catch (error) {
      console.log('WhatsApp service not available yet');
    }
  };

  const connectToWhatsApp = async () => {
    setAuthState(prev => ({ ...prev, isConnecting: true, error: undefined }));
    
    try {
      // Check WhatsApp service status (no initialization needed for standalone service)
      const statusResponse = await fetch('http://localhost:3001/status');
      
      if (!statusResponse.ok) {
        throw new Error('WhatsApp service not available');
      }
      
      // Start polling for status updates
      pollConnectionStatus();
      
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isConnecting: false,
        error: 'Failed to connect to WhatsApp. Please try again.'
      }));
    }
  };

  const pollConnectionStatus = () => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:3001/status');
        const status = await response.json();

        if (status.qr && !authState.isAuthenticated) {
          setAuthState(prev => ({ ...prev, qrCode: status.qr }));
        }

        if (status.ready && status.authenticated) {
          setAuthState(prev => ({
            ...prev,
            isAuthenticated: true,
            isConnecting: false,
            clientInfo: status.clientInfo
          }));

          clearInterval(interval);
          onAuthenticated();
        }
        
      } catch (error) {
        console.error('Status polling error:', error);
      }
    }, 2000);

    // Clear interval after 5 minutes if not connected
    setTimeout(() => {
      clearInterval(interval);
      if (!authState.isAuthenticated) {
        setAuthState(prev => ({
          ...prev,
          isConnecting: false,
          error: 'Connection timeout. Please try again.'
        }));
      }
    }, 300000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Unified WhatsApp Chat
          </h1>
          <p className="text-gray-600">
            Connect your WhatsApp to get started
          </p>
        </div>

        {/* Connection Status */}
        {!authState.isConnecting && !authState.qrCode && (
          <div className="text-center">
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <Smartphone size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">
                Ready to Connect
              </h3>
              <p className="text-sm text-gray-600">
                Click below to generate a QR code and scan it with your WhatsApp mobile app
              </p>
            </div>
            
            <button
              onClick={connectToWhatsApp}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Connect WhatsApp
            </button>
          </div>
        )}

        {/* Loading State */}
        {authState.isConnecting && !authState.qrCode && (
          <div className="text-center">
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <Loader2 size={48} className="text-green-600 mx-auto mb-4 animate-spin" />
              <h3 className="font-semibold text-gray-800 mb-2">
                Connecting...
              </h3>
              <p className="text-sm text-gray-600">
                Setting up your WhatsApp connection
              </p>
            </div>
          </div>
        )}

        {/* QR Code Display */}
        {authState.qrCode && !authState.isAuthenticated && (
          <div className="text-center">
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="bg-white p-4 rounded-lg inline-block mb-4">
                {authState.qrCode ? (
                  <img 
                    src={authState.qrCode} 
                    alt="WhatsApp QR Code" 
                    className="w-48 h-48 rounded-lg"
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 size={32} className="text-gray-400 mx-auto mb-2 animate-spin" />
                      <p className="text-xs text-gray-500">Generating QR Code...</p>
                    </div>
                  </div>
                )}
              </div>
              
              <h3 className="font-semibold text-gray-800 mb-2">
                Scan QR Code
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>1. Open WhatsApp on your phone</p>
                <p>2. Go to Settings → Linked Devices</p>
                <p>3. Tap "Link a Device"</p>
                <p>4. Scan this QR code</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-green-600">
              <Wifi size={16} />
              <span className="text-sm">Waiting for scan...</span>
            </div>
          </div>
        )}

        {/* Success State */}
        {authState.isAuthenticated && (
          <div className="text-center">
            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-green-800 mb-2">
                Connected Successfully!
              </h3>
              <p className="text-sm text-green-600">
                {authState.clientInfo?.pushname || 'WhatsApp'} is now connected
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {authState.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 text-sm">{authState.error}</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            Your messages are processed locally and securely
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
