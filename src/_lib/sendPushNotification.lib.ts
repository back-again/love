export interface PushNotificationPayload {
  to: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

export async function sendPushNotificationLib(
  payload: PushNotificationPayload,
): Promise<boolean> {
  if (!payload.to || !payload.to.startsWith('ExponentPushToken')) {
    return false;
  }

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: payload.to,
        sound: 'default',
        title: payload.title,
        body: payload.body,
        data: payload.data || {},
      }),
    });

    const resData = await response.json();
    return resData?.data?.status === 'ok';
  } catch (error) {
    console.error('Send push notification failed:', error);
    return false;
  }
}
