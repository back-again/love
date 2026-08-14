import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const SEGMENT_COLORS = [
  '#FFE0E6',
  '#FFBFCB',
  '#FF9EB0',
  '#FF7D96',
  '#FF5D7B',
];

interface StatSegmentRowProps {
  label: string;
  level?: number;
  maxLevel?: number;
}

export function StatSegmentRow({
  label,
  level = 0,
  maxLevel = 5,
}: StatSegmentRowProps) {
  const segments = Array.from({ length: maxLevel }, (_, i) => i + 1);

  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabelText}>{label}</Text>
      <View style={styles.segmentBarWrap}>
        {segments.map(seg => {
          const isFilled = seg <= level;
          const segColor = SEGMENT_COLORS[seg - 1] || '#FF5D7B';

          return (
            <View
              key={seg}
              style={[
                styles.segmentPill,
                isFilled
                  ? { backgroundColor: segColor }
                  : styles.segmentPillEmpty,
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statLabelText: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '600',
  },
  segmentBarWrap: {
    flexDirection: 'row',
    gap: 4,
  },
  segmentPill: {
    width: 28,
    height: 6,
    borderRadius: 3,
  },
  segmentPillEmpty: {
    backgroundColor: '#F1F5F9',
  },
});
