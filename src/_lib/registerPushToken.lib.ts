import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from '@/api/supabase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerPushTokenLib(): Promise<string | null> {
  if (Platform.OS === 'web') return null;

  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF8E7A',
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Push notification permission not granted:', finalStatus);
      return null;
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ||
      Constants.easConfig?.projectId ||
      '745f0442-b0a2-4109-b4fd-07271672dfef';

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    const pushToken = tokenData.data;

    console.log('Successfully acquired Expo Push Token:', pushToken);

    if (pushToken) {
      const { data: authData } = await supabase.auth.getUser();
      const currentUserId =
        authData.user?.id || '00000000-0000-0000-0000-000000000001';

      const { error } = await supabase
        .from('users')
        .update({ push_token: pushToken, notification_allowed: true })
        .eq('id', currentUserId);

      if (error) {
        console.error('Failed to update push_token in Supabase:', error.message);
      } else {
        console.log('Updated push_token in Supabase for user:', currentUserId);
      }
    }

    return pushToken;
  } catch (error) {
    console.error('Failed to get or save push token:', error);
    return null;
  }
}
