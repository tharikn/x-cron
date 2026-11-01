import type { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.xcron.jobs',
  appName: 'X Cron Jobs',
  webDir: 'www',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    LocalNotifications: {
      sound: 'default',
      presentationOptions: ['badge', 'sound', 'banner', 'list'],
    },
  },
};

export default config;
