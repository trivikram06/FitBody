import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
export default app;
