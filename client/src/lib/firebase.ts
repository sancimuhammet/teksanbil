import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, query, orderBy, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth functions
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore functions
export const addStoryToFirestore = async (storyData: any) => {
  try {
    console.log('Attempting to add story to Firestore:', storyData);
    const docRef = await addDoc(collection(db, 'stories'), {
      ...storyData,
      createdAt: new Date(),
      published: true,
      views: 0,
      likes: 0
    });
    console.log('Story added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Firestore error:', error);
    throw error;
  }
};

export const getStoriesFromFirestore = async () => {
  try {
    const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const stories: any[] = [];
    querySnapshot.forEach((doc) => {
      stories.push({ id: doc.id, ...doc.data() });
    });
    return stories;
  } catch (error) {
    throw error;
  }
};

export const getStoryFromFirestore = async (id: string) => {
  try {
    const docRef = doc(db, 'stories', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};