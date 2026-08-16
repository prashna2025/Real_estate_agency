import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, BedDouble, Bath, Square } from 'lucide-react';
import { cn } from '../../utils/cn';

const PropertyCard = ({ property, className }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className={cn("group flex flex-col bg-white border border-stone rounded-sm overflow-hidden", className)}>
      {/* Image Container */}
      <Link to={`/property/${property.slug}`} className="relative aspect-[4/3] overflow-hidden bg-cream-dark">
        <img 
          src={property.images[0] ? `http://localhost:5000${property.images[0]}` : 'https://via.placeholder.com/800x600?text=No+Image'} 
          alt={property.title} 
          className="w-full h-full object-cover transition-transform duration-700 ease-slow-ease group-hover:scale-105"
        />
        {/* Status Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold uppercase tracking-wider text-charcoal rounded-sm shadow-sm">
          {property.status}
        </div>
        {property.isFeatured && (
          <div className="absolute top-4 right-4 bg-terracotta text-white px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-sm shadow-sm">
            Featured
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-terracotta font-serif text-xl font-semibold mb-2">
          {formatPrice(property.price)}
        </p>
        <Link to={`/property/${property.slug}`}>
          <h3 className="text-charcoal font-serif text-lg leading-snug mb-2 group-hover:text-terracotta transition-colors duration-300 line-clamp-2">
            {property.title}
          </h3>
        </Link>
        <div className="flex items-center text-charcoal-muted text-sm mb-5">
          <MapPin size={14} className="mr-1.5" />
          <span className="truncate">{property.location}, {property.city}</span>
        </div>
        
        {/* Features Footer */}
        <div className="mt-auto pt-4 border-t border-stone flex justify-between text-charcoal-muted text-sm">
          <div className="flex items-center gap-1.5">
            <BedDouble size={16} />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath size={16} />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Square size={16} />
            <span>{property.area} Sq.Ft</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;