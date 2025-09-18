import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = { 
  apiKey: "AIzaSyAGlstVuPqqjYs-q0CDmIxsflL3ol-IeCU", 
  authDomain: "fitbody-4d341.firebaseapp.com", 
  projectId: "fitbody-4d341", 
  storageBucket: "fitbody-4d341.firebasestorage.app", 
  messagingSenderId: "688173913441", 
  appId: "1:688173913441:web:e87287da7ee1f099b56120", 
  measurementId: "G-JBHDFLRCL9" 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
export default app;