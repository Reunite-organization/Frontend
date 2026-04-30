import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wantedApi } from '../services/wantedApi';
import { useLanguage } from '../../../lib/i18n';
import { toast } from 'sonner';

export const useSubmitClaim = () => {
  const queryClient = useQueryClient();
  const { language } = useLanguage();

  return useMutation({
    mutationFn: ({ postId, messageToPoster, claimedPersonIndex }) =>
      wantedApi.submitClaim(postId, { messageToPoster, claimedPersonIndex }),
    onSuccess: (data) => {
      toast.success(
        language === 'am'
          ? 'የይገባኛል ጥያቄዎ በተሳካ ሁኔታ ቀርቧል'
          : 'Your claim has been submitted successfully'
      );
      queryClient.invalidateQueries({ queryKey: ['wanted', 'claims'] });
      queryClient.invalidateQueries({ queryKey: ['wanted', 'post'] });
    },
    onError: (error) => {
      toast.error(
        language === 'am'
          ? error.response?.data?.message || 'የይገባኛል ጥያቄ ማቅረብ አልተሳካም'
          : error.response?.data?.message || 'Failed to submit claim'
      );
    },
  });
};

export const usePendingClaims = () => {
  return useQuery({
    queryKey: ['wanted', 'claims', 'pending'],
    queryFn: () => wantedApi.getPendingClaims(),
    staleTime: 30 * 1000,
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
          ? data.status === 'approved'
            ? 'ጥያቄው ጸድቋል'
            : 'ጥያቄው ውድቅ ተደርጓል'
          : data.status === 'approved'
            ? 'Claim approved'
            : 'Claim rejected'
      );
      queryClient.invalidateQueries({ queryKey: ['wanted', 'claims'] });
      queryClient.invalidateQueries({ queryKey: ['wanted', 'chat'] });
      queryClient.invalidateQueries({ queryKey: ['wanted', 'post'] });
    },
    onError: (error) => {
      toast.error(
        language === 'am'
          ? 'ግምገማ አልተሳካም'
          : error.response?.data?.message || 'Review failed'
      );
    },
  });
};

// Withdraw claim (for claimant)
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
    onError: (error) => {
      toast.error(
        language === 'am'
          ? 'መሰረዝ አልተሳካም'
          : error.response?.data?.message || 'Failed to withdraw claim'
      );
    },
  });
};

export const useClaims = () => {
  const submitClaim = useSubmitClaim();
  const reviewClaim = useReviewClaim();
  const withdrawClaim = useWithdrawClaim();

  return {
    submitClaim: submitClaim.mutate,
    isSubmitting: submitClaim.isPending,
    reviewClaim: reviewClaim.mutate,
    isReviewing: reviewClaim.isPending,
    withdrawClaim: withdrawClaim.mutate,
    isWithdrawing: withdrawClaim.isPending,
  };
};
