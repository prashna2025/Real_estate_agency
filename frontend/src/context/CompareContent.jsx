import React, { createContext, useContext, useEffect, useState } from 'react';

const CompareContext = createContext(null);
const STORAGE_KEY = 'boutiqueEstateCompare';
const MAX_COMPARE_ITEMS = 4;

export const CompareProvider = ({ children }) => {
	const [compareItems, setCompareItems] = useState(() => {
		try {
			const storedItems = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
			return Array.isArray(storedItems) ? storedItems : [];
		} catch {
			return [];
		}
	});

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(compareItems));
	}, [compareItems]);

	const isCompared = (propertyId) => compareItems.some((item) => item._id === propertyId);

	const toggleCompare = (property) => {
		setCompareItems((currentItems) => {
			if (currentItems.some((item) => item._id === property._id)) {
				return currentItems.filter((item) => item._id !== property._id);
			}
			if (currentItems.length >= MAX_COMPARE_ITEMS) return currentItems;
			return [...currentItems, property];
		});
	};

	const removeFromCompare = (propertyId) => {
		setCompareItems((currentItems) => currentItems.filter((item) => item._id !== propertyId));
	};

	return (
		<CompareContext.Provider value={{ compareItems, isCompared, toggleCompare, removeFromCompare, maxItems: MAX_COMPARE_ITEMS }}>
			{children}
		</CompareContext.Provider>
	);
};

export const useCompare = () => useContext(CompareContext);
