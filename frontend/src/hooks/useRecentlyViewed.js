import { useState } from 'react';

const STORAGE_KEY = 'boutiqueEstateRecentlyViewed';
const MAX_ITEMS = 4;

const readStoredItems = () => {
	try {
		const storedItems = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
		return Array.isArray(storedItems) ? storedItems : [];
	} catch {
		return [];
	}
};

const useRecentlyViewed = () => {
	const [recentlyViewed, setRecentlyViewed] = useState(readStoredItems);

	const addRecentlyViewed = (property) => {
		setRecentlyViewed((currentItems) => {
			const updatedItems = [property, ...currentItems.filter((item) => item._id !== property._id)].slice(0, MAX_ITEMS);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
			return updatedItems;
		});
	};

	return { recentlyViewed, addRecentlyViewed };
};

export default useRecentlyViewed;
