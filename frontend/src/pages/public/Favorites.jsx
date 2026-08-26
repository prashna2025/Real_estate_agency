import React from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '../../components/common/PropertyCard';
import { useFavorites } from '../../context/FavoritesContext';

const Favorites = () => {
  const { favoriteItems } = useFavorites();

  if (favoriteItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="font-serif text-4xl mb-4">Saved properties</h1>
        <p className="text-charcoal-muted mb-8">Keep the listings you love in one place while you continue your search.</p>
        <Link to="/properties" className="inline-flex bg-terracotta text-white px-6 py-3 rounded-sm hover:bg-terracotta-hover transition-colors">Browse properties</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="font-serif text-4xl mb-2">Saved properties</h1>
          <p className="text-charcoal-muted">{favoriteItems.length} {favoriteItems.length === 1 ? 'property' : 'properties'} saved for later.</p>
        </div>
        <Link to="/properties" className="text-terracotta font-medium hover:underline">Explore more properties</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {favoriteItems.map((property) => <PropertyCard key={property._id} property={property} />)}
      </div>
    </div>
  );
};

export default Favorites;