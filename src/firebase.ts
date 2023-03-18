import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { getStorage, ref } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGUNG_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const dataBase = getFirestore(app);
export const storage = getStorage(app);
export const messageRef = collection(dataBase, 'messages');
export const queryRef = query(messageRef, orderBy('createdAt', 'asc'), limit(15));
export const docsSnap = getDocs(messageRef);
export const imageRef = ref(storage);