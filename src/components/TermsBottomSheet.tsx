import React from 'react';
import TermsScreen from '@/screens/terms/TermsScreen';
import PrivacyScreen from '@/screens/privacy/PrivacyScreen';

interface TermsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  contentType?: 'terms' | 'privacy';
}

export default function TermsBottomSheet({
  visible,
  onClose,
  contentType = 'terms',
}: TermsBottomSheetProps) {
  if (contentType === 'privacy') {
    return <PrivacyScreen visible={visible} onClose={onClose} />;
  }

  return <TermsScreen visible={visible} onClose={onClose} />;
}
