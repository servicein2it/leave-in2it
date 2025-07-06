import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration - these will be injected by the server
const firebaseConfig = {
  apiKey: "dummy-api-key",
  authDomain: "dummy-auth-domain",
  projectId: "dummy-project-id", 
  storageBucket: "dummy-storage-bucket",
  messagingSenderId: "dummy-sender-id",
  appId: "dummy-app-id"
};

// Check if we have valid Firebase configuration
const hasValidFirebaseConfig = () => {
  return firebaseConfig.apiKey && 
         firebaseConfig.authDomain && 
         firebaseConfig.projectId && 
         firebaseConfig.storageBucket && 
         firebaseConfig.messagingSenderId && 
         firebaseConfig.appId &&
         firebaseConfig.apiKey !== 'dummy-api-key' &&
         firebaseConfig.projectId !== 'dummy-project-id';
};

let app: any = null;
let auth: any = null;
let db: any = null;

export const isFirebaseConfigured = hasValidFirebaseConfig();

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
} else {
  console.warn('Firebase configuration not found. Using mock services.');
}

export { auth, db };
export default app;