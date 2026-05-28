import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.FIREBASE_API_KEY': JSON.stringify(env.VITE_FIREBASE_API_KEY || env.FIREBASE_API_KEY || env.VITE_FIREBASE_API_ || env.FIREBASE_API_ || ''),
      'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(env.VITE_FIREBASE_AUTH_DOMAIN || env.FIREBASE_AUTH_DOMAIN || env.VITE_FIREBASE_AUT || env.FIREBASE_AUT || ''),
      'process.env.FIREBASE_PROJECT_ID': JSON.stringify(env.VITE_FIREBASE_PROJECT_ID || env.FIREBASE_PROJECT_ID || env.VITE_FIREBASE_PRO || env.FIREBASE_PRO || ''),
      'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(env.VITE_FIREBASE_STORAGE_BUCKET || env.FIREBASE_STORAGE_BUCKET || env.VITE_FIREBASE_STO || env.FIREBASE_STO || ''),
      'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(env.VITE_FIREBASE_MESSAGING_SENDER_ID || env.FIREBASE_MESSAGING_SENDER_ID || env.VITE_FIREBASE_MES || env.FIREBASE_MES || ''),
      'process.env.FIREBASE_APP_ID': JSON.stringify(env.VITE_FIREBASE_APP_ID || env.FIREBASE_APP_ID || env.VITE_FIREBASE_APP_ || env.FIREBASE_APP_ || ''),
      'process.env.FIREBASE_MEASUREMENT_ID': JSON.stringify(env.VITE_FIREBASE_MEASUREMENT_ID || env.FIREBASE_MEASUREMENT_ID || env.VITE_FIREBASE_MEA || env.FIREBASE_MEA || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
