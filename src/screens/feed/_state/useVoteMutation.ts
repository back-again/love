import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';
import { submitVoteLib } from '../_lib/submitVote.lib';
import { FetchFeedResponse } from '../_lib/getFeedPosts.lib';
import { saveVotedPostIdToStorage } from '../_lib/voteStorage.lib';

export function useVoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, choice }: { postId: string; choice: 'O' | 'X' }) => {
      await saveVotedPostIdToStorage(postId);
      await submitVoteLib(postId, choice);
    },
    onMutate: async ({ postId, choice }) => {
      saveVotedPostIdToStorage(postId);
      await queryClient.cancelQueries({ queryKey: ['feedPosts'] });

      const previousFeedData = queryClient.getQueriesData<InfiniteData<FetchFeedResponse>>({
        queryKey: ['feedPosts'],
      });

      queryClient.setQueriesData<InfiniteData<FetchFeedResponse>>(
        { queryKey: ['feedPosts'] },
        old => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map(page => ({
              ...page,
              userVoteMap: {
                ...page.userVoteMap,
                [postId]: choice,
              },
              rawPosts: page.rawPosts.map(post => {
                if (post.id !== postId) return post;
                const prevVote = page.userVoteMap?.[postId];
                let vote_o_count = post.vote_o_count ?? 0;
                let vote_x_count = post.vote_x_count ?? 0;

                if (prevVote === 'O') vote_o_count = Math.max(0, vote_o_count - 1);
                if (prevVote === 'X') vote_x_count = Math.max(0, vote_x_count - 1);

                if (choice === 'O') vote_o_count += 1;
                if (choice === 'X') vote_x_count += 1;

                return {
                  ...post,
                  vote_o_count,
                  vote_x_count,
                };
              }),
            })),
          };
        },
      );

      return { previousFeedData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousFeedData) {
        context.previousFeedData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feedPosts'] });
    },
  });
}
