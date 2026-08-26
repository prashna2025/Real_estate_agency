import React, { createContext, useContext, useEffect, useState } from 'react';

const FavoritesContext = createContext(null);
const STORAGE_KEY = 'boutiqueEstateFavorites';

export const FavoritesProvider = ({ children }) => {
  const [favoriteItems, setFavoriteItems] = useState(() => {
    try {
      const storedItems = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(storedItems) ? storedItems : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteItems));
  }, [favoriteItems]);

  const isFavorite = (propertyId) => favoriteItems.some((item) => item._id === propertyId);

  const toggleFavorite = (property) => {
    setFavoriteItems((currentItems) => currentItems.some((item) => item._id === property._id)
      ? currentItems.filter((item) => item._id !== property._id)
      : [...currentItems, property]);
  };

  return (
    <FavoritesContext.Provider value={{ favoriteItems, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);