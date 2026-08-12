import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types/database.types';
import { useUserStore } from './useUserStore';
import { supabase } from '@/api/supabase';
import { registerPushTokenLib } from '@/_lib/registerPushToken.lib';

const STORAGE_KEYS = {
  USER_SESSION: '@user_session',
};

export function useLoadApp() {
  const { user, setUser, clearUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSavedSession = async () => {
      try {
        const savedUserStr = await AsyncStorage.getItem(
          STORAGE_KEYS.USER_SESSION,
        );
        if (savedUserStr) {
          setUser(JSON.parse(savedUserStr));
        }
      } catch (error) {
        console.error('Failed to load session from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedSession();
  }, [setUser]);

  const handleLoginSuccess = async (userData: User) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_SESSION,
        JSON.stringify(userData),
      );
      setUser(userData);
      registerPushTokenLib();
    } catch (error) {
      console.error('Failed to save user session:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_SESSION);
      await supabase.auth.signOut();
      clearUser();
    } catch (error) {
      console.error('Failed to clear session from storage:', error);
    }
  };

  const hasOnboarded = Boolean(user?.gender && user?.birth_year);

  return {
    user,
    hasOnboarded,
    isLoading,
    handleLoginSuccess,
    handleLogout,
  };
}
