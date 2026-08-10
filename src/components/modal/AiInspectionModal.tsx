import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface AiInspectionModalProps {
  visible: boolean;
  onClose: () => void;
  reason?: string;
  suggestion?: string;
}

export function AiInspectionModal({
  visible,
  onClose,
  reason,
  suggestion,
}: AiInspectionModalProps) {
  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              {/* Top AI Badge Icon */}
              <View style={styles.iconCircle}>
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Circle cx={12} cy={12} r={9} stroke="#FF5D7B" strokeWidth={2} />
                  <Path d="M9 10h.01M15 10h.01" stroke="#FF5D7B" strokeWidth={3} strokeLinecap="round" />
                  <Path d="M9.5 15c1 1 3.5 1 5 0" stroke="#FF5D7B" strokeWidth={2} strokeLinecap="round" />
                </Svg>
              </View>

              {/* Title */}
              <Text style={styles.modalTitle}>AI 사연 검토 결과</Text>

              {/* Reason */}
              <Text style={styles.reasonText}>
                {reason || '작성하신 내용을 AI가 검토한 결과 수정이 필요해요.'}
              </Text>

              {/* Suggestion Card */}
              {suggestion ? (
                <View style={styles.suggestionCard}>
                  <Text style={styles.suggestionTitle}>💡 AI의 가이드 팁</Text>
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </View>
              ) : null}

              {/* Action Button */}
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={onClose}
                activeOpacity={0.85}
              >
                <Text style={styles.confirmButtonText}>내용 수정하러 가기</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF8F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFD1DC',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
    textAlign: 'center',
  },
  reasonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF5D7B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 14,
  },
  suggestionCard: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  suggestionTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 12.5,
    fontWeight: '400',
    color: '#64748B',
    lineHeight: 18,
  },
  confirmButton: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FF5D7B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF5D7B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
