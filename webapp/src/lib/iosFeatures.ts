// iOS-specific features for MyMe WhatsApp Chat
import { Capacitor } from '@capacitor/core';

// Check if running on iOS
export const isIOS = () => {
  return Capacitor.getPlatform() === 'ios';
};

// Haptic feedback (install @capacitor/haptics)
export const iosHapticFeedback = async () => {
  if (isIOS()) {
    try {
      const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      console.log('Haptics not available');
    }
  }
};

// Status bar styling (install @capacitor/status-bar)
export const setStatusBarStyle = async (dark: boolean) => {
  if (isIOS()) {
    try {
      const { StatusBar, Style } = await import('@capacitor/status-bar');
      await StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light });
    } catch (error) {
      console.log('StatusBar not available');
    }
  }
};

// Safe area handling
export const getSafeAreaInsets = () => {
  if (typeof window !== 'undefined' && isIOS()) {
    return {
      top: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sat') || '0'),
      bottom: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sab') || '0'),
    };
  }
  return { top: 0, bottom: 0 };
};

// Mobile-specific utilities
export const isMobile = () => {
  return typeof window !== 'undefined' && (window.innerWidth < 768 || isIOS());
};