import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wantedApi } from '../services/wantedApi';
import { useLanguage } from '../../../lib/i18n';
import { toast } from 'sonner';

export const useClaims = () => {
  const queryClient = useQueryClient();
  const { language } = useLanguage();

  const submitClaim = useMutation({
    mutationFn: ({ postId, answers, messageToPoster }) => 
      wantedApi.submitClaim(postId, { answers, messageToPoster }),
    onSuccess: (data) => {
      toast.success(
        language === 'am' 
          ? 'የይገባኛል ጥያቄዎ በተሳካ ሁኔታ ቀርቧል' 
          : 'Your claim has been submitted successfully'
      );
      queryClient.invalidateQueries({ queryKey: ['wanted', 'claims'] });
    },
    onError: (error) => {
      toast.error(
        language === 'am'
          ? 'የይገባኛል ጥያቄ ማቅረብ አልተሳካም'
          : error.message || 'Failed to submit claim'
      );
    },
  });

  return {
    submitClaim: submitClaim.mutate,
    isSubmitting: submitClaim.isPending,
  };
};

export const usePendingClaims = () => {
  return useQuery({
    queryKey: ['wanted', 'claims', 'pending'],
    queryFn: () => wantedApi.getPendingClaims(),
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useMyClaims = () => {
  return useQuery({
    queryKey: ['wanted', 'claims', 'my'],
    queryFn: () => wantedApi.getMyClaims(),
  });
};

export const useReviewClaim = () => {
  const queryClient = useQueryClient();
  const { language } = useLanguage();

  return useMutation({
    mutationFn: ({ claimId, status, rejectionReason }) =>
      wantedApi.reviewClaim(claimId, { status, rejectionReason }),
    onSuccess: (data) => {
      toast.success(
        language === 'am'
          ? data.status === 'approved' ? 'ጥያቄው ጸድቋል' : 'ጥያቄው ውድቅ ተደርጓል'
          : data.status === 'approved' ? 'Claim approved' : 'Claim rejected'
      );
      queryClient.invalidateQueries({ queryKey: ['wanted', 'claims'] });
      queryClient.invalidateQueries({ queryKey: ['wanted', 'chat'] });
    },
  });
};

export const useWithdrawClaim = () => {
  const queryClient = useQueryClient();
  const { language } = useLanguage();

  return useMutation({
    mutationFn: (claimId) => wantedApi.withdrawClaim(claimId),
    onSuccess: () => {
      toast.success(
        language === 'am'
          ? 'የይገባኛል ጥያቄዎ ተሰርዟል'
          : 'Your claim has been withdrawn'
      );
      queryClient.invalidateQueries({ queryKey: ['wanted', 'claims'] });
    },
  });
};
