import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lifehorizon.app',
  appName: 'Life Horizon',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      overlaysWebView: true
    }
  }
};

export default config;
