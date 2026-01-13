import { useState, useCallback } from 'react';
import type { ISportsMatch } from 'src/types';

type GetSportsMatchesFn = (params: {
  SportId: string;
  EventStatus: 'PRE' | 'TODAY' | 'HOUR' | 'LIVE' | 'ALL';
  lang: string;
}) => Promise<{ data?: ISportsMatch[] }>;

export const useSportsData = (
  getSportsMatches: GetSportsMatchesFn,
  activeSport: number,
  startIn: 'PRE' | 'TODAY' | 'HOUR' | 'LIVE' | 'ALL',
  currentLang: string
) => {
  const [sportsMatchs, setSportsMatchs] = useState<ISportsMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSportsMatches = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSportsMatches({
        SportId: activeSport.toString(),
        EventStatus: startIn,
        lang: currentLang,
      });
      if (res?.data) {
        setSportsMatchs(res.data);
      }
    } catch (error) {
      console.error('Error fetching sports matches:', error);
      // TODO: Add proper error handling
    } finally {
      setLoading(false);
    }
  }, [getSportsMatches, activeSport, startIn, currentLang]);

  return {
    sportsMatchs,
    loading,
    fetchSportsMatches,
  };
}; 