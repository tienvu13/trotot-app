import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FavoritesContextType = {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = 'favorites_list';

export function FavoritesProvider({ children }: PropsWithChildren) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved) {
        try {
          const ids = JSON.parse(saved) as string[];
          setFavorites(ids);
        } catch {
          setFavorites([]);
        }
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)).catch(() => {
      // ignore write failures silently
    });
  }, [favorites]);

  const value = useMemo(
    () => ({
      favorites,
      toggleFavorite: (id: string) =>
        setFavorites((current) =>
          current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        ),
      isFavorite: (id: string) => favorites.includes(id),
    }),
    [favorites]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}
