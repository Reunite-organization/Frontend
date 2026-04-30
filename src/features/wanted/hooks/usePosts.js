import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wantedApi } from '../services/wantedApi';
import { offlineStorage } from '../services/offlineStorage';
import { toast } from 'sonner';
import { useLanguage } from '../../../lib/i18n';


export const usePosts = (filters = {}) => {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => 
      value !== '' && value !== null && value !== undefined
    )
  );

  const query = useInfiniteQuery({
    queryKey: ['wanted', 'posts', cleanFilters],
    queryFn: ({ pageParam = 1 }) => wantedApi.getPosts({ 
      ...cleanFilters, 
      page: pageParam 
    }),
    getNextPageParam: (lastPage) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const posts = query.data?.pages?.flatMap(page => {
    return page?.data || page?.posts || [];
  }) || [];

  // Filter valid posts
  const validPosts = posts.filter(p => p && p._id);

  return {
    ...query,
    data: {
      pages: query.data?.pages || [],
      posts: validPosts,
    },
  };
};

// Get single post
export const usePost = (id) => {
  return useQuery({
    queryKey: ['wanted', 'post', id],
    queryFn: () => wantedApi.getPost(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
};

// Create post
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  
  return useMutation({
    mutationFn: (data) => wantedApi.createPost(data),
    onSuccess: () => {
      toast.success(
        language === 'am' 
          ? 'ልጥፍ በተሳካ ሁኔታ ተፈጥሯል' 
          : 'Post created successfully'
      );
      queryClient.invalidateQueries({ queryKey: ['wanted', 'posts'] });
      queryClient.invalidateQueries({ queryKey: ['wanted', 'my-posts'] });
    },
    onError: async (error, variables) => {
      toast.error(
        language === 'am'
          ? 'ልጥፍ መፍጠር አልተሳካም'
          : error.message || 'Failed to create post'
      );
      // Store failed post creation for offline retry
      await offlineStorage.addToQueue('createPost', variables);
    },
  });
};

// Update post
export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  
  return useMutation({
    mutationFn: ({ id, data }) => wantedApi.updatePost(id, data),
    onSuccess: () => {
      toast.success(
        language === 'am'
          ? 'ልጥፍ በተሳካ ሁኔታ ዘምኗል'
          : 'Post updated successfully'
      );
      queryClient.invalidateQueries({ queryKey: ['wanted', 'posts'] });
      queryClient.invalidateQueries({ queryKey: ['wanted', 'my-posts'] });
    },
    onError: (error) => {
      toast.error(
        language === 'am'
          ? 'ልጥፍ ማዘመን አልተሳካም'
          : error.message || 'Failed to update post'
      );
    },
  });
};

// Delete post
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  
  return useMutation({
    mutationFn: (id) => wantedApi.deletePost(id),
    onSuccess: () => {
      toast.success(
        language === 'am'
          ? 'ልጥፍ በተሳካ ሁኔታ ተሰርዟል'
          : 'Post deleted successfully'
      );
      queryClient.invalidateQueries({ queryKey: ['wanted', 'posts'] });
      queryClient.invalidateQueries({ queryKey: ['wanted', 'my-posts'] });
    },
    onError: (error) => {
      toast.error(
        language === 'am'
          ? 'ልጥፍ መሰረዝ አልተሳካም'
          : error.message || 'Failed to delete post'
      );
    },
  });
};

// Get user's posts
export const useUserPosts = (status, enabled = true) => {
  return useQuery({
    queryKey: ['wanted', 'my-posts', status],
    queryFn: () => wantedApi.getMyPosts(status),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
};

// Mark post as reconnected
export const useMarkReconnected = () => {
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  
  return useMutation({
    mutationFn: ({ id, successStory }) => wantedApi.markReconnected(id, successStory),
    onSuccess: () => {
      toast.success(
        language === 'am'
          ? 'እንኳን ደስ አለዎት! እንደገና ተገናኝተዋል!'
          : 'Congratulations! You have reconnected!'
      );
      queryClient.invalidateQueries({ queryKey: ['wanted', 'posts'] });
      queryClient.invalidateQueries({ queryKey: ['wanted', 'my-posts'] });
      queryClient.invalidateQueries({ queryKey: ['wanted', 'stories'] });
    },
    onError: (error) => {
      toast.error(
        language === 'am'
          ? 'ማድረግ አልተሳካም'
          : error.message || 'Failed to mark as reconnected'
      );
    },
  });
};

// Share post
export const useSharePost = () => {
  return useMutation({
    mutationFn: (id) => wantedApi.sharePost(id),
  });
};

// ============ SUCCESS STORIES ============

// Get success stories
export const useSuccessStories = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['wanted', 'stories', page, limit],
    queryFn: () => wantedApi.getSuccessStories(page, limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};


// Add this new hook to usePosts.js
export const useStoryActions = () => {
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  
  const shareStory = useMutation({
    mutationFn: (data) => wantedApi.shareStory(data),
    onSuccess: () => {
      toast.success(
        language === 'am'
          ? 'ታሪክዎ ተጋርቷል! ስላካፈሉ እናመሰግናለን!'
          : 'Your story has been shared! Thank you for inspiring others!'
      );
      queryClient.invalidateQueries({ queryKey: ['wanted', 'stories'] });
      queryClient.invalidateQueries({ queryKey: ['wanted', 'my-posts'] });
    },
    onError: (error) => {
      toast.error(
        language === 'am'
          ? 'ታሪክ ማካፈል አልተሳካም'
          : error.message || 'Failed to share story'
      );
      throw error; 
    },
  });
  
  return {
    shareStory: shareStory.mutateAsync, 
    isSharing: shareStory.isPending,
    shareError: shareStory.error,
  };
};

// Get featured success stories
export const useFeaturedStories = () => {
  return useQuery({
    queryKey: ['wanted', 'stories', 'featured'],
    queryFn: () => wantedApi.getFeaturedStories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Like a success story
export const useLikeStory = () => {
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  
  return useMutation({
    mutationFn: (postId) => wantedApi.likeStory(postId),
    onSuccess: (data, postId) => {
      queryClient.invalidateQueries({ queryKey: ['wanted', 'stories'] });
      queryClient.invalidateQueries({ queryKey: ['wanted', 'post', postId] });
    },
    onError: (error) => {
      toast.error(
        language === 'am'
          ? 'ላይክ ማድረግ አልተሳካም'
          : error.message || 'Failed to like story'
      );
    },
  });
};

// Share success story
export const useShareStory = () => {
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  
  return useMutation({
    mutationFn: (data) => wantedApi.shareStory(data),
    onSuccess: () => {
      toast.success(
        language === 'am'
          ? 'ታሪክዎ ተጋርቷል! ስላካፈሉ እናመሰግናለን!'
          : 'Your story has been shared! Thank you for inspiring others!'
      );
      queryClient.invalidateQueries({ queryKey: ['wanted', 'stories'] });
      queryClient.invalidateQueries({ queryKey: ['wanted', 'my-posts'] });
    },
    onError: (error) => {
      toast.error(
        language === 'am'
          ? 'ታሪክ ማካፈል አልተሳካም'
          : error.message || 'Failed to share story'
      );
    },
  });
};

