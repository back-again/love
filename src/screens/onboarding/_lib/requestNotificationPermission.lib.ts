import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return true;
  }

  const isExpoGo =
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

  if (isExpoGo) {
    return true;
  }

  try {
    const Notifications = require('expo-notifications');

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.warn('Notification permission error:', error);
    return true;
  }
}
