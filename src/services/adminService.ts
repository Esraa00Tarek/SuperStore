import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { functions, auth } from '../firebase/config';

export const setAdminRole = async (uid: string, isAdmin: boolean) => {
  try {
    const setAdminRoleFn = httpsCallable(functions, 'setAdminRole');
    const result = await setAdminRoleFn({ uid, isAdmin });
    return result.data;
  } catch (error) {
    console.error('Error setting admin role:', error);
    throw error;
  }
};

export const isAdmin = async (): Promise<boolean> => {
  try {
    const user = auth.currentUser;
    if (!user) return false;
    
    const idTokenResult = await user.getIdTokenResult();
    return !!idTokenResult.claims.admin;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Initialize emulator in development
if (import.meta.env.DEV) {
  connectFunctionsEmulator(functions, 'localhost', 5001);
}
