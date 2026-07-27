import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import LoginScreen from '@/screens/login/LoginScreen';
import OnboardingScreen from '@/screens/onboarding/OnboardingScreen';
import HomeScreen from '@/components/HomeScreen';

import { User } from '@/types/database.types';
import { useLoadApp } from '@/_state/useLoadApp';

const queryClient = new QueryClient();

export type RootStackParamList = {
  Login: undefined;
  Onboarding: { user: User };
  Home: { user: User };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const { user, hasOnboarded, isLoading, handleLoginSuccess, handleLogout } =
    useLoadApp();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF8E7A" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Stack.Navigator
            screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
          >
            {!user ? (
              <Stack.Screen name="Login">
                {() => <LoginScreen onLoginSuccess={handleLoginSuccess} />}
              </Stack.Screen>
            ) : !hasOnboarded ? (
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            ) : (
              <Stack.Screen
                name="Home"
                component={() => (
                  <HomeScreen user={user} onLogout={handleLogout} />
                )}
              />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </QueryClientProvider>
    </GestureHandlerRootView>
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
