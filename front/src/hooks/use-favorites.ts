/**
 * Custom React hook for managing favorite sports matches with localStorage persistence.
 * Provides add, remove, toggle, and clear operations for favorite match IDs.
 * Note: Automatically syncs with localStorage on mount and whenever favorites change.
 */
import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'favoriteMatches';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
        setFavorites([]);
      }
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = useCallback((matchId: number) => {
    setFavorites(prev => {
      if (!prev.includes(matchId)) {
        return [...prev, matchId];
      }
      return prev;
    });
  }, []);

  const removeFavorite = useCallback((matchId: number) => {
    setFavorites(prev => prev.filter(id => id !== matchId));
  }, []);

  const toggleFavorite = useCallback((matchId: number) => {
    setFavorites(prev => {
      if (prev.includes(matchId)) {
        return prev.filter(id => id !== matchId);
      }
      return [...prev, matchId];
    });
  }, []);

  const isFavorite = useCallback((matchId: number) => favorites.includes(matchId), [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length,
  };
};

export default useFavorites;
