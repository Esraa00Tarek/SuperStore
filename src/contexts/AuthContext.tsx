import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  UserCredential,
  Auth,
  getAuth,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  setDoc, 
  serverTimestamp,
  DocumentData,
  getDoc
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';

interface UserData {
  uid?: string;  // Make uid optional since we might not have it during creation
  email: string;
  username: string;
  displayName: string;
  createdAt?: any;
  updatedAt?: any;
  [key: string]: any;  // Allow additional properties
}

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (identifier: string) => Promise<string>;
  checkAdminStatus: () => Promise<boolean>;
  auth: Auth;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAdminStatus = useCallback(async (user: FirebaseUser | null) => {
    if (!user) {
      setIsAdmin(false);
      return false;
    }
    
    try {
      const idTokenResult = await user.getIdTokenResult();
      const isUserAdmin = !!idTokenResult.claims.admin;
      setIsAdmin(isUserAdmin);
      return isUserAdmin;
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      return false;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await checkAdminStatus(user);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [checkAdminStatus]);

  const login = async (identifier: string, password: string, rememberMe: boolean = false): Promise<void> => {
    try {
      // Set persistence based on rememberMe
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      // Check if identifier is an email
      if (identifier.includes('@')) {
        // Login with email
        await signInWithEmailAndPassword(auth, identifier, password);
      } else {
        // Search for username in Firestore
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", identifier.toLowerCase().trim()));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          throw new Error('Username not found');
        }
        
        // Get the first matching user (usernames should be unique)
        const userData = snapshot.docs[0].data();
        const userEmail = userData.email;
        
        if (!userEmail) {
          throw new Error('No email associated with this username');
        }
        
        // Login with the found email
        await signInWithEmailAndPassword(auth, userEmail, password);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  async function signup(email: string, password: string, displayName: string): Promise<UserCredential> {
    try {
      setLoading(true);
      setError(null);
      
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with display name
      await updateProfile(userCredential.user, { displayName });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: email.toLowerCase().trim(),
        username: displayName.toLowerCase().trim(),
        displayName: displayName.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return userCredential;
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Clean up partially created user if Firestore operation fails
      if (auth.currentUser) {
        try {
          await auth.currentUser.delete();
        } catch (deleteError) {
          console.error('Error cleaning up user after failed signup:', deleteError);
        }
      }
      
      // Handle specific error cases
      let errorMessage = 'An error occurred during signup.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use. Please use a different email.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Please choose a stronger password (at least 6 characters).';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      } else if (error.code) {
        errorMessage = `Authentication error: ${error.code}`;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      setError(error.message);
      throw error;
    }
  }

  async function resetPassword(identifier: string) {
    try {
      setLoading(true);
      setError(null);
      
      // Check if the identifier is an email
      const isEmail = identifier.includes('@');
      let emailToUse = identifier;
      
      if (!isEmail) {
        // Lookup username in Firestore to get the associated email
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', identifier.toLowerCase().trim()));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          throw { 
            code: 'auth/user-not-found', 
            message: 'No account found with that username or email' 
          };
        }
        
        // Get the first matching user (usernames should be unique)
        const userDoc = querySnapshot.docs[0];
        emailToUse = userDoc.data().email;
      }
      
      // Send password reset email
      await sendPasswordResetEmail(auth, emailToUse);
      return emailToUse;
      
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      let errorMessage = 'Failed to send password reset email. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with that username or email';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address';
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const value = {
    currentUser,
    isAdmin,
    login,
    signup,
    logout,
    resetPassword,
    checkAdminStatus: () => checkAdminStatus(currentUser),
    loading,
    error,
    auth,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading authentication...</div>}
      {error && <div>Error: {error}</div>}
    </AuthContext.Provider>
  );
}
