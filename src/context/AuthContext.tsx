'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useMemo, useCallback } from 'react';
import {
    User,
    onAuthStateChanged,
    signInWithPopup,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    browserLocalPersistence,
    setPersistence,
    inMemoryPersistence,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Pre-configure provider with faster options
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account', // Always show account picker (faster than 'consent')
});

// Set persistence once at module level
let persistenceSet = false;
const ensurePersistence = async () => {
    if (!persistenceSet) {
        try {
            await setPersistence(auth, browserLocalPersistence);
        } catch (err) {
            console.warn('Third-party cookies may be blocked. Falling back to in-memory persistence.', err);
            await setPersistence(auth, inMemoryPersistence);
        }
        persistenceSet = true;
    }
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Ensure persistence is set early
        ensurePersistence();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = useCallback(async () => {
        try {
            await ensurePersistence();
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error('Error signing in with Google:', error);
            throw error;
        }
    }, []);

    const signOut = useCallback(async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    }, []);

    // Memoize context value to prevent unnecessary re-renders
    const value = useMemo(() => ({
        user,
        loading,
        signInWithGoogle,
        signOut
    }), [user, loading, signInWithGoogle, signOut]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
