import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { signIn, signUp, signOut, signInWithGoogle, getProfile, updateProfile } from '@/lib/auth';
import type { AppUser, TreeSpecies } from '@/lib/database.types';
import { profileToAppUser } from '@/lib/database.types';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  completeOnboarding: (forestName: string, dailyBudget: number, treeSpecies: TreeSpecies) => Promise<void>;
  refreshProfile: () => Promise<void>;
  isOnboarded: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile from DB and set user state
  const loadProfile = async (userId: string) => {
    const profile = await getProfile(userId);
    if (profile) {
      setUser(profileToAppUser(profile));
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await loadProfile(user.id);
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Subscribe to changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const u = session.user;
        // For OAuth users, populate profile display_name & email from Google metadata
        const meta = u.user_metadata;
        if (meta?.full_name || meta?.name || u.email) {
          supabase
            .from('profiles')
            .update({
              display_name: meta?.full_name || meta?.name || '',
              email: u.email || '',
            })
            .eq('id', u.id)
            .then(() => {
              // Run in background to prevent Supabase auth mutex deadlock
              loadProfile(u.id).catch(console.error);
            });
        } else {
          loadProfile(u.id).catch(console.error);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const authUser = await signIn(email, password);
      if (authUser) {
        await loadProfile(authUser.id);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const authUser = await signUp(name, email, password);
      if (authUser) {
        // Give the trigger a moment to create profile row, then load
        await new Promise(r => setTimeout(r, 500));
        await loadProfile(authUser.id);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Signup error:', err);
      return false;
    }
  };

  const loginWithGoogle = async () => {
    await signInWithGoogle();
    // The redirect will happen automatically.
    // When the user comes back, onAuthStateChange will fire SIGNED_IN
    // and loadProfile will run in the background.
  };

  const logout = async () => {
    await signOut();
    setUser(null);
  };

  const completeOnboarding = async (
    forestName: string,
    dailyBudget: number,
    treeSpecies: TreeSpecies
  ) => {
    if (!user) return;
    const updated = await updateProfile(user.id, {
      forest_name: forestName,
      daily_budget: dailyBudget,
      tree_species: treeSpecies,
    });
    if (updated) {
      setUser(profileToAppUser(updated));
    }
  };

  const isOnboarded = !!user && !!user.forestName && user.dailyBudget > 0;

  return (
    <AuthContext.Provider
      value={{ user, loading, login, loginWithGoogle, signup, logout, completeOnboarding, refreshProfile, isOnboarded }}
    >
      {children}
    </AuthContext.Provider>
  );
}
