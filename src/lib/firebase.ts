import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const getEnv = (key: string) => {
  const env = (import.meta as any).env;
  // Intenta el nombre completo primero
  if (env[key]) return env[key];
  
  // Mapeo específico para los nombres truncados vistos en la captura del usuario
  const truncMap: Record<string, string> = {
    'VITE_FIREBASE_API_KEY': 'VITE_FIREBASE_API_',
    'VITE_FIREBASE_AUTH_DOMAIN': 'VITE_FIREBASE_AUT',
    'VITE_FIREBASE_PROJECT_ID': 'VITE_FIREBASE_PRO',
    'VITE_FIREBASE_STORAGE_BUCKET': 'VITE_FIREBASE_STO',
    'VITE_FIREBASE_MESSAGING_SENDER_ID': 'VITE_FIREBASE_MES',
    'VITE_FIREBASE_APP_ID': 'VITE_FIREBASE_APP_',
    'VITE_FIREBASE_MEASUREMENT_ID': 'VITE_FIREBASE_MEA'
  };

  const truncKey = truncMap[key];
  return env[truncKey] || env[key.substring(0, 16)] || env[key.substring(0, 15)];
};

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: process.env.FIREBASE_PROJECT_ID || getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: process.env.FIREBASE_APP_ID || getEnv('VITE_FIREBASE_APP_ID'),
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || getEnv('VITE_FIREBASE_MEASUREMENT_ID')
};

// Validación previa para dar un error más claro
if (!firebaseConfig.apiKey) {
  console.warn("⚠️ Firebase API Key no detectada. Verifica los nombres en la pestaña 'Secrets'.");
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
