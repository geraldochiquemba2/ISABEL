import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'guialocal_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse favorites from local storage', e);
    }
  }, []);

  const toggleFavorite = (storeId: string) => {
    setFavorites((prev) => {
      const isFavorited = prev.includes(storeId);
      const next = isFavorited 
        ? prev.filter((id) => id !== storeId)
        : [...prev, storeId];
        
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isFavorite = (storeId: string) => favorites.includes(storeId);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
}
