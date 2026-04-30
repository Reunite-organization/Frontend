import { useQuery } from '@tanstack/react-query';
import { wantedApi } from '../services/wantedApi';

export const useImpactStats = () => {
  return useQuery({
    queryKey: ['wanted', 'impact-stats'],
    queryFn: () => wantedApi.getImpactStats(),
    staleTime: 30 * 60 * 1000, 
    refetchOnWindowFocus: false,
  });
};
