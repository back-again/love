import React from 'react';
import MyMenuBottomSheet from './MyMenuBottomSheet';

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
  return (
    <MyMenuBottomSheet
      visible={visible}
      menuType={contentType}
      onClose={onClose}
    />
  );
}
