import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import LoginScreen from '@/screens/login/LoginScreen';
import OnboardingScreen from '@/components/OnboardingScreen';
import HomeScreen from '@/components/HomeScreen';
import { supabase } from '@/api/supabase';

import { User } from '@/types/database.types';

const queryClient = new QueryClient();

export type RootStackParamList = {
  Login: undefined;
  Onboarding: { user: User };
  Home: { user: User };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const STORAGE_KEYS = {
  USER_SESSION: '@user_session',
  ONBOARDING_DATA: '@onboarding_data',
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved session on app startup
  useEffect(() => {
    const loadSavedSession = async () => {
      try {
        const savedUserStr = await AsyncStorage.getItem(
          STORAGE_KEYS.USER_SESSION,
        );
        const savedOnboardingStr = await AsyncStorage.getItem(
          STORAGE_KEYS.ONBOARDING_DATA,
        );

        if (savedUserStr) {
          setUser(JSON.parse(savedUserStr));
        }
        if (savedOnboardingStr) {
          setOnboardingData(JSON.parse(savedOnboardingStr));
        }
      } catch (error) {
        console.error('Failed to load session from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const u = session.user;
        
        // Fetch or insert strictly based on DB users table schema
        let { data: dbUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', u.id)
          .single();

        if (!dbUser) {
          const { data: newDbUser } = await supabase.from('users').upsert({
            id: u.id,
            email: u.email || '',
            provider: 'google',
          }).select().single();
          dbUser = newDbUser;
        }

        if (dbUser) {
          if (dbUser.gender && dbUser.birth_year) {
            setOnboardingData({
              gender: dbUser.gender,
              birthYear: String(dbUser.birth_year),
              notificationAllowed: dbUser.notification_allowed,
            });
          }
          handleLoginSuccess(dbUser);
        }
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Login handler
  const handleLoginSuccess = async (userData: User) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_SESSION,
        JSON.stringify(userData),
      );
      setUser(userData);
    } catch (error) {
      console.error('Failed to save user session:', error);
    }
  };

  // Onboarding complete handler
  const handleOnboardingComplete = async (data: any) => {
    try {
      if (user?.id) {
        const { data: updatedDbUser } = await supabase.from('users').update({
          gender: data.gender,
          birth_year: data.birthYear ? parseInt(data.birthYear, 10) : null,
          notification_allowed: data.notificationAllowed || false,
        }).eq('id', user.id).select().single();

        if (updatedDbUser) {
          setUser(updatedDbUser);
          await AsyncStorage.setItem(
            STORAGE_KEYS.USER_SESSION,
            JSON.stringify(updatedDbUser),
          );
        }
      }

      await AsyncStorage.setItem(
        STORAGE_KEYS.ONBOARDING_DATA,
        JSON.stringify(data),
      );
      setOnboardingData(data);
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_SESSION,
        STORAGE_KEYS.ONBOARDING_DATA,
      ]);
      setUser(null);
      setOnboardingData(null);
    } catch (error) {
      console.error('Failed to clear session from storage:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF8E7A" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
        >
          {!user ? (
            // 1. Auth Stack (로그인 전 페이지)
            <Stack.Screen name="Login">
              {() => <LoginScreen onLoginSuccess={handleLoginSuccess} />}
            </Stack.Screen>
          ) : !onboardingData ? (
            // 2. Onboarding Stack (로그인 후 온보딩 미완료)
            <Stack.Screen name="Onboarding">
              {() => (
                <OnboardingScreen
                  user={user}
                  onComplete={handleOnboardingComplete}
                />
              )}
            </Stack.Screen>
          ) : (
            // 3. App Main Stack (로그인 및 온보딩 완료 후 메인홈 피드)
            <Stack.Screen name="Home">
              {() => <HomeScreen user={user} onLogout={handleLogout} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
