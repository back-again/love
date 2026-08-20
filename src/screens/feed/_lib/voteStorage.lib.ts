import AsyncStorage from '@react-native-async-storage/async-storage';

export const USER_VOTED_POST_IDS_KEY = '@user_voted_post_ids';

export async function saveVotedPostIdToStorage(postId: string): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(USER_VOTED_POST_IDS_KEY);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    if (!ids.includes(postId)) {
      ids.push(postId);
      await AsyncStorage.setItem(USER_VOTED_POST_IDS_KEY, JSON.stringify(ids));
    }
  } catch (error) {
    console.warn('Failed to save voted post id to storage:', error);
  }
}

export async function getVotedPostIdsFromStorage(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(USER_VOTED_POST_IDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
