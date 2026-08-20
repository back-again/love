'use client';

import { useShallow } from 'zustand/react/shallow';
import { OptionItem } from '../_component/OptionItem';
import { usePostOptionsStore } from '../_state/usePostOptionsStore';
import { useCreateForm } from '@/screens/create/_state/useCreateForm';
import { useToastStore } from '@/_state/useToastStore';
import { navigate } from '@/_lib/navigation';

export function EditOptionAction() {
  const { targetPost, closePostOptions } = usePostOptionsStore(
    useShallow(state => ({
      targetPost: state.targetPost,
      closePostOptions: state.closePostOptions,
    }))
  );
  const showToast = useToastStore(state => state.showToast);

  const handleEdit = () => {
    if (!targetPost) return;
    closePostOptions();

    // 1. Populate the write form state with target post data
    useCreateForm.setState({
      questionTitle: targetPost.title || '',
      category: targetPost.category || '고민',
      detailSituation: targetPost.content || '',
      images: targetPost.images || [],
      voteO: targetPost.voteO || '',
      voteX: targetPost.voteX || '',
      isEditMode: true,
      editPostId: targetPost.id,
    });

    showToast('사연 수정 모드로 전환되었습니다.');
    navigate('Create');
  };

  return (
    <OptionItem
      type="edit"
      label="게시글 수정하기"
      onPress={handleEdit}
    />
  );
}
