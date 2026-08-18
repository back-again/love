'use client';

import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { RelationshipQuizModalAction } from './_action/RelationshipQuizModal.action';
import { RelationshipProfileHandler } from './_handler/RelationshipProfile.handler';
import { DoorimiFloatingFabAction } from './_action/DoorimiFloatingFab.action';
import { ChatDetailScreen } from './detail/ChatDetailScreen';

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.hubScrollView}
        contentContainerStyle={[styles.hubContentContainer, { paddingTop: 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.sectionHeaderRow, { marginTop: 8 }]}>
          <Text style={styles.sectionTitle}>나의 연애 성향</Text>
        </View>

        <RelationshipProfileHandler />
      </ScrollView>

      <DoorimiFloatingFabAction />
      <RelationshipQuizModalAction />
      <ChatDetailScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  hubScrollView: {
    flex: 1,
  },
  hubContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 140,
  },
  sectionHeaderRow: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
});
