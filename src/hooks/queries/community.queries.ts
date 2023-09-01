import { useQuery } from '@tanstack/react-query';
import { getCommunity, getCommunityList } from '/api/api';

export function useGetCommunityListQuery() {
  return useQuery({
    queryKey: ['getCommunityList'],
    queryFn: getCommunityList,
    retry: 0,
    suspense: true,
  });
}

export function useGetCommunityInfoQuery(id: number | undefined) {
  return useQuery({
    queryKey: ['getCommunityInfo', id],
    queryFn: () => getCommunity(id),
    retry: 0,
    suspense: true,
    enabled: id !== undefined,
  });
}
