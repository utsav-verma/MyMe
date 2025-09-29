import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.myme.whatsappchat',
  appName: 'MyMe WhatsApp Chat',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#25D366',
      showSpinner: false
    },
    StatusBar: {
      style: 'dark'
    }
  }
};

export default config;