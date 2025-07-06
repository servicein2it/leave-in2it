import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dummy-auth-domain",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy-project-id", 
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dummy-storage-bucket",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "dummy-sender-id",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "dummy-app-id"
};

// Check if we have valid Firebase configuration
const hasValidFirebaseConfig = () => {
  const hasConfig = firebaseConfig.apiKey && 
         firebaseConfig.authDomain && 
         firebaseConfig.projectId && 
         firebaseConfig.storageBucket && 
         firebaseConfig.messagingSenderId && 
         firebaseConfig.appId &&
         firebaseConfig.apiKey !== 'dummy-api-key' &&
         firebaseConfig.projectId !== 'dummy-project-id';
  
  console.log('Firebase config check:', { hasConfig, apiKey: firebaseConfig.apiKey });
  return hasConfig;
};

let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

export const isFirebaseConfigured = hasValidFirebaseConfig();

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log('Firebase initialized successfully with project:', firebaseConfig.projectId);
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    console.warn('Falling back to mock services due to Firebase error');
    // Reset Firebase status if initialization fails
    app = null;
    auth = null;
    db = null;
    storage = null;
  }
} else {
  console.warn('Firebase configuration not found. Using mock services.');
}

export { auth, db, storage };
export default app;