import React, { Suspense } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WrittenPostsArea } from './_area/WrittenPosts.area';
import { FeedbackOpenAction } from './_action/FeedbackOpen.action';
import { InquiryOpenAction } from './_action/InquiryOpen.action';

export default function MyScreen() {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient colors={['#FFFFFF', '#FFFFFF']} style={styles.container}>
      <ScrollView
        style={styles.myPageScrollView}
        contentContainerStyle={[
          styles.myPageContentContainer,
          { paddingTop: insets.top + 60 + 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Suspense
          fallback={
            <View style={styles.mySectionLoading}>
              <ActivityIndicator size="small" color="#FF8E7A" />
            </View>
          }
        >
          <WrittenPostsArea />
        </Suspense>

        <View style={styles.myMenuTileRow}>
          <FeedbackOpenAction />
          <InquiryOpenAction />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  myPageScrollView: {
    flex: 1,
    width: '100%',
  },
  myPageContentContainer: {
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 120,
  },
  mySectionLoading: {
    marginBottom: 30,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myMenuTileRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
});
