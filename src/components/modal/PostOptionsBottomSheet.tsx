import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface PostOptionsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  isMyPost?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onBlock?: () => void;
  onReport?: () => void;
}

export function PostOptionsBottomSheet({
  visible,
  onClose,
  isMyPost = false,
  onEdit,
  onDelete,
  onBlock,
  onReport,
}: PostOptionsBottomSheetProps) {
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
            <View style={styles.sheetContainer}>
              <View style={styles.handleBar} />

              <Text style={styles.sheetTitle}>더보기</Text>

              {isMyPost ? (
                <>
                  {/* Author Options: Edit / Delete */}
                  <TouchableOpacity
                    style={styles.optionRow}
                    onPress={() => {
                      onClose();
                      if (onEdit) onEdit();
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.iconCircle}>
                      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                        <Path
                          d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                          stroke="#727272"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <Path
                          d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                          stroke="#727272"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Svg>
                    </View>
                    <Text style={styles.optionText}>게시글 수정하기</Text>
                  </TouchableOpacity>

                  <View style={styles.divider} />

                  <TouchableOpacity
                    style={styles.optionRow}
                    onPress={() => {
                      onClose();
                      if (onDelete) onDelete();
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.iconCircle, styles.dangerIconCircle]}>
                      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                        <Path
                          d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
                          stroke="#F9758D"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Svg>
                    </View>
                    <Text style={[styles.optionText, styles.dangerOptionText]}>
                      게시글 삭제하기
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  {/* Viewer Options: Block / Report */}
                  <TouchableOpacity
                    style={styles.optionRow}
                    onPress={() => {
                      onClose();
                      if (onBlock) onBlock();
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.iconCircle}>
                      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                        <Path
                          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                          stroke="#727272"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Svg>
                    </View>
                    <Text style={styles.optionText}>작성자 차단하기</Text>
                  </TouchableOpacity>

                  <View style={styles.divider} />

                  <TouchableOpacity
                    style={styles.optionRow}
                    onPress={() => {
                      onClose();
                      if (onReport) onReport();
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.iconCircle, styles.dangerIconCircle]}>
                      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                        <Path
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          stroke="#F9758D"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Svg>
                    </View>
                    <Text style={[styles.optionText, styles.dangerOptionText]}>
                      게시글 신고하기
                    </Text>
                  </TouchableOpacity>
                </>
              )}
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    alignItems: 'center',
  },
  handleBar: {
    width: 36,
    height: 4,
    backgroundColor: '#EBEBEB',
    borderRadius: 2,
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  optionRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    gap: 14,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerIconCircle: {
    backgroundColor: '#FEEBED',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  dangerOptionText: {
    color: '#F9758D',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F5F5F5',
  },
});
