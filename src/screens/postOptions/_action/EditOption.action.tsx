'use client';

import { useNavigation } from '@react-navigation/native';
import { OptionItem } from '../_component/OptionItem';
import { usePostOptionsStore } from '../_state/usePostOptionsStore';
import { useCreateForm } from '@/screens/create/_state/useCreateForm';
import { useToastStore } from '@/_state/useToastStore';

export function EditOptionAction() {
  const navigation = useNavigation<any>();
  const { targetPost, closePostOptions } = usePostOptionsStore(state => ({
    targetPost: state.targetPost,
    closePostOptions: state.closePostOptions,
  }));
  const showToast = useToastStore(state => state.showToast);

  const handleEdit = () => {
    if (!targetPost) return;
    closePostOptions();

    // 1. Populate the write form state with target post data
    useCreateForm.setState({
      questionTitle: targetPost.title || '',
      category: targetPost.category || '고민',
      detailSituation: targetPost.fullStory || '',
      images: targetPost.images || [],
      voteO: targetPost.voteO || '',
      voteX: targetPost.voteX || '',
      isVoteEnabled: Boolean(targetPost.voteO || targetPost.voteX),
      isEditMode: true,
      editPostId: targetPost.id,
    });

    showToast('사연 수정 모드로 전환되었습니다.');
    navigation.navigate('Create');
  };

  return (
    <OptionItem
      type="edit"
      label="게시글 수정하기"
      onPress={handleEdit}
    />
  );
}
