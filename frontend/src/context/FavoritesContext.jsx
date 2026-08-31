import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const FavoritesContext = createContext(null);
const STORAGE_KEY = 'boutiqueEstateFavorites';

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  
  const [favoriteItems, setFavoriteItems] = useState(() => {
    try {
      const storedItems = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(storedItems) ? storedItems : [];
    } catch {
      return [];
    }
  });

  // Sync with user.favorites if logged in
  useEffect(() => {
    if (user && user.favorites) {
      setFavoriteItems(user.favorites);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user.favorites));
    }
  }, [user]);

  // Save to local storage for guests
  useEffect(() => {
    if (!user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteItems));
    }
  }, [favoriteItems, user]);

  const isFavorite = (propertyId) => favoriteItems.some((item) => item._id === propertyId);

  const toggleFavorite = async (property) => {
    if (user) {
      // Optimistic update
      setFavoriteItems((currentItems) => currentItems.some((item) => item._id === property._id)
        ? currentItems.filter((item) => item._id !== property._id)
        : [...currentItems, property]);
      
      try {
        const { data } = await api.post('/users/favorites', { propertyId: property._id });
        setFavoriteItems(data); // Sync with backend's true state
        // We also need to update the AuthContext's user object so it stays in sync
        const storedUser = JSON.parse(localStorage.getItem('userInfo'));
        if (storedUser) {
           storedUser.favorites = data;
           localStorage.setItem('userInfo', JSON.stringify(storedUser));
        }
      } catch (error) {
        console.error('Failed to toggle favorite', error);
        // Revert on error could be implemented here
      }
    } else {
      setFavoriteItems((currentItems) => currentItems.some((item) => item._id === property._id)
        ? currentItems.filter((item) => item._id !== property._id)
        : [...currentItems, property]);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favoriteItems, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);