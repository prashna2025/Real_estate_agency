import React, { createContext, useContext, useEffect, useState } from 'react';

const FavoritesContext = createContext(null);
const STORAGE_KEY = 'boutiqueEstateFavorites';

export const FavoritesProvider = ({ children }) => {
  const [favoriteItems, setFavoriteItems] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteItems));
  }, [favoriteItems]);

  const isFavorite = (propertyId) =>
    favoriteItems.some((item) => item._id === propertyId);

  const toggleFavorite = (property) => {
    setFavoriteItems((current) =>
      current.some((item) => item._id === property._id)
        ? current.filter((item) => item._id !== property._id)
        : [...current, property]
    );
  };

  return (
    <FavoritesContext.Provider value={{ favoriteItems, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);