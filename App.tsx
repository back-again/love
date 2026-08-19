// AI AGENT NOTICE: Always read AGENTS.md in project root before writing or modifying any code.
import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from '@/screens/login/LoginScreen';
import OnboardingScreen from '@/screens/onboarding/OnboardingScreen';
import MyScreen from '@/screens/my/MyScreen';
import CreateScreen from '@/screens/create/CreateScreen';
import ChatScreen from '@/screens/chat/ChatScreen';
import { Layout } from '@/components/layout/Layout';

import { User } from '@/types/database.types';
import { useLoadApp } from '@/_state/useLoadApp';
import FeedScreen from '@/screens/feed/FeedScreen';
import { navigationRef } from '@/_lib/navigation';

import { useTabStore } from '@/_state/useTabStore';

const queryClient = new QueryClient();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

export type RootStackParamList = {
  Login: undefined;
  Onboarding: { user: User };
  Home: { user: User };
  Feed: undefined;
  Chat: undefined;
  Create: undefined;
  Rank: { user: User };
  My: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function MainAppLayout() {
  const activeTab = useTabStore(state => state.activeTab);
  const setActiveTab = useTabStore(state => state.setActiveTab);

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <View style={styles.tabContainer}>
        <View
          style={[
            styles.tabContent,
            activeTab === 'feed' ? styles.tabActive : styles.tabInactive,
          ]}
        >
          <FeedScreen />
        </View>
        <View
          style={[
            styles.tabContent,
            activeTab === 'create' ? styles.tabActive : styles.tabInactive,
          ]}
        >
          <CreateScreen />
        </View>
        <View
          style={[
            styles.tabContent,
            activeTab === 'chat' ? styles.tabActive : styles.tabInactive,
          ]}
        >
          <ChatScreen />
        </View>
        <View
          style={[
            styles.tabContent,
            activeTab === 'my' ? styles.tabActive : styles.tabInactive,
          ]}
        >
          <MyScreen />
        </View>
      </View>
    </Layout>
  );
}

export default function App() {
  const { user, hasOnboarded, isLoading, handleLoginSuccess } = useLoadApp();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF8E7A" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <BottomSheetModalProvider>
            <NavigationContainer ref={navigationRef} theme={navTheme}>
              <StatusBar style="dark" />
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                  animation: 'slide_from_right',
                  contentStyle: { backgroundColor: 'transparent' },
                }}
              >
                {!user ? (
                  <Stack.Screen name="Login">
                    {props => (
                      <LoginScreen
                        {...props}
                        onLoginSuccess={handleLoginSuccess}
                      />
                    )}
                  </Stack.Screen>
                ) : !hasOnboarded ? (
                  <Stack.Screen
                    name="Onboarding"
                    component={OnboardingScreen}
                  />
                ) : (
                  <Stack.Screen name="Main" component={MainAppLayout} />
                )}
              </Stack.Navigator>
            </NavigationContainer>
          </BottomSheetModalProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
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
  tabContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  tabContent: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  tabActive: {
    display: 'flex',
  },
  tabInactive: {
    display: 'none',
  },
});
