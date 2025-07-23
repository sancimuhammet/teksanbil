import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, query, orderBy, where, updateDoc, increment, arrayUnion, arrayRemove, setDoc, deleteDoc } from "firebase/firestore";

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

// User registration
export const registerWithEmail = async (email: string, password: string, displayName: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    
    // Create user profile in Firestore
    await setDoc(doc(db, 'users', result.user.uid), {
      email: email,
      displayName: displayName,
      createdAt: new Date(),
      likedStories: [],
      commentCount: 0,
      storiesRead: []
    });
    
    return result.user;
  } catch (error) {
    throw error;
  }
};

// Get user profile from Firestore
export const getUserProfile = async (uid: string) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    throw error;
  }
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
    console.log('Fetching stories from Firestore...');
    const storiesRef = collection(db, 'stories');
    const q = query(storiesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const stories = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('Firebase stories fetched:', stories.length, 'stories');
    return stories;
  } catch (error) {
    console.error('Error fetching stories from Firestore:', error);
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

// Like/Unlike story
export const toggleStoryLike = async (storyId: string, userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const storyRef = doc(db, 'stories', storyId);
    
    const userDoc = await getDoc(userRef);
    const likedStories = userDoc.data()?.likedStories || [];
    
    if (likedStories.includes(storyId)) {
      // Unlike
      await updateDoc(userRef, {
        likedStories: arrayRemove(storyId)
      });
      await updateDoc(storyRef, {
        likes: increment(-1)
      });
      return false;
    } else {
      // Like
      await updateDoc(userRef, {
        likedStories: arrayUnion(storyId)
      });
      await updateDoc(storyRef, {
        likes: increment(1)
      });
      return true;
    }
  } catch (error) {
    throw error;
  }
};

// Add comment
export const addComment = async (storyId: string, userId: string, content: string, authorName: string) => {
  try {
    const commentData = {
      storyId,
      userId,
      authorName,
      content,
      createdAt: new Date(),
      likes: 0
    };
    
    const docRef = await addDoc(collection(db, 'comments'), commentData);
    
    // Update user comment count
    await updateDoc(doc(db, 'users', userId), {
      commentCount: increment(1)
    });
    
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

// Get comments for a story
export const getStoryComments = async (storyId: string) => {
  try {
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('storyId', '==', storyId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
};

// Increment story views
export const incrementStoryViews = async (storyId: string) => {
  try {
    const storyRef = doc(db, 'stories', storyId);
    await updateDoc(storyRef, {
      views: increment(1)
    });
  } catch (error) {
    console.warn('Error incrementing views:', error);
  }
};

// Delete story from Firestore
export const deleteStoryFromFirestore = async (storyId: string) => {
  try {
    const storyRef = doc(db, 'stories', storyId);
    await deleteDoc(storyRef);
    console.log('Story deleted successfully:', storyId);
  } catch (error) {
    console.error('Error deleting story:', error);
    throw error;
  }
};