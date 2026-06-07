import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nexora.neurolearn',
  appName: 'Nexora AI',
  webDir: 'dist',
  android: {
    backgroundColor: '#0a0f19',
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
  },
  server: {
    // For production: set this to your deployed backend URL
    // For development: Android emulator uses 10.0.2.2 to reach host localhost
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 1500,
      backgroundColor: '#0a0f19',
      showSpinner: true,
      spinnerColor: '#0d9488',
      androidSpinnerStyle: 'small',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0a0f19',
    },
  },
};

export default config;
