import { useMemo } from 'react';
import type { ISportsMatch } from 'src/types';

export const useSportsSearch = (matches: ISportsMatch[], searchQuery: string) => {
  const filteredMatches = useMemo(() => {
    if (!searchQuery) return matches;

    return matches.reduce<ISportsMatch[]>((result, row) => {
      const filteredEvents = row.events.filter(
        (event) =>
          event.home.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.away.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (filteredEvents.length) {
        result.push({ ...row, events: filteredEvents });
      }

      return result;
    }, []);
  }, [matches, searchQuery]);

  return { filteredMatches };
}; 