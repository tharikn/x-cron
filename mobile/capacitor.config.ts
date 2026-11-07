import type { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.xcron.jobs',
  appName: 'X Cron Jobs',
  webDir: 'www',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      // Keep native splash until AppComponent dismisses after boot.
      launchAutoHide: false,
      launchFadeOutDuration: 280,
      backgroundColor: '#070412',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER',
      showSpinner: false,
    },
    LocalNotifications: {
      // Android status-bar glyph (white silhouette drawable) + brand accent.
      smallIcon: 'ic_stat_xcron',
      iconColor: '#7c5cff',
      sound: 'default',
      presentationOptions: ['badge', 'sound', 'banner', 'list'],
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
