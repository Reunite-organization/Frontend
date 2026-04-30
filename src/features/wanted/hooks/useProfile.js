import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wantedApi } from '../services/wantedApi';
import { useLanguage } from '../../../lib/i18n';
import { toast } from 'sonner';

export const useWantedProfile = () => {
  return useQuery({
    queryKey: ['wanted', 'profile'],
    queryFn: () => wantedApi.getProfile(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  const { language } = useLanguage();

  return useMutation({
    mutationFn: (data) => wantedApi.createProfile(data),
    onSuccess: () => {
      toast.success(
        language === 'am'
          ? 'መገለጫ በተሳካ ሁኔታ ተፈጥሯል'
          : 'Profile created successfully'
      );
      queryClient.invalidateQueries({ queryKey: ['wanted', 'profile'] });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { language } = useLanguage();

  return useMutation({
    mutationFn: (data) => wantedApi.updateProfile(data),
    onSuccess: () => {
      toast.success(
        language === 'am'
          ? 'መገለጫ በተሳካ ሁኔታ ዘምኗል'
          : 'Profile updated successfully'
      );
      queryClient.invalidateQueries({ queryKey: ['wanted', 'profile'] });
    },
  });
};

export const usePublicProfile = (userId) => {
  return useQuery({
    queryKey: ['wanted', 'profile', userId],
    queryFn: () => wantedApi.getPublicProfile(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  });
};
