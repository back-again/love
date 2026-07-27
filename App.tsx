import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import LoginScreen from '@/screens/login/LoginScreen';
import OnboardingScreen from '@/screens/onboarding/OnboardingScreen';
import HomeScreen from '@/components/HomeScreen';
import MyScreen from '@/screens/my/MyScreen';
import CreateScreen from '@/screens/create/CreateScreen';
import { Layout, MainTabType } from '@/components/layout/Layout';

import { User } from '@/types/database.types';
import { useLoadApp } from '@/_state/useLoadApp';
import FeedScreen from '@/screens/feed/FeedScreen';

const queryClient = new QueryClient();

export type RootStackParamList = {
  Login: undefined;
  Onboarding: { user: User };
  Home: { user: User };
  Feed: undefined;
  Create: undefined;
  Rank: { user: User };
  My: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const MainStack = createNativeStackNavigator<RootStackParamList>();

function MainAppLayout({ mainNavRef }: { mainNavRef: any }) {
  const [activeTab, setActiveTab] = useState<MainTabType>('create');

  const handleTabChange = (tab: MainTabType) => {
    setActiveTab(tab);

    if (mainNavRef.current?.isReady()) {
      if (tab === 'create') {
        mainNavRef.current.navigate('Create');
      } else if (tab === 'my') {
        mainNavRef.current.navigate('My');
      } else if (tab === 'feed') {
        mainNavRef.current.navigate('Feed');
      }
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={handleTabChange}>
      <MainStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
        screenListeners={{
          state: e => {
            const currentRoute = e.data.state.routes[e.data.state.index];
            if (currentRoute) {
              const routeName = currentRoute.name.toLowerCase();

              if (routeName === 'create') setActiveTab('create');
              else if (routeName === 'my') setActiveTab('my');
              else if (routeName === 'feed') setActiveTab('feed');
            }
          },
        }}
      >
        <MainStack.Screen name="Feed" component={FeedScreen} />
        <MainStack.Screen name="Create" component={CreateScreen} />
        <MainStack.Screen name="My" component={MyScreen} />
      </MainStack.Navigator>
    </Layout>
  );
}

export default function App() {
  const { user, hasOnboarded, isLoading, handleLoginSuccess } = useLoadApp();
  const navigationRef = useNavigationContainerRef();

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
        <NavigationContainer ref={navigationRef}>
          <StatusBar style="dark" />
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          >
            {!user ? (
              <Stack.Screen name="Login">
                {() => <LoginScreen onLoginSuccess={handleLoginSuccess} />}
              </Stack.Screen>
            ) : !hasOnboarded ? (
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            ) : (
              // <Stack.Screen name="Home">
              //   {() => <HomeScreen user={user!} onLogout={() => {}} />}
              // </Stack.Screen>
              <Stack.Screen name="Main">
                {() => <MainAppLayout mainNavRef={navigationRef} />}
              </Stack.Screen>
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
