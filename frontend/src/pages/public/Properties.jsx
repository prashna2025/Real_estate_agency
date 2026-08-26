import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import { api } from '../../services/api';
import PropertyCard from '../../components/common/PropertyCard';
import Button from '../../components/common/Button';

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    type: searchParams.get('type') || '',
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    sort: searchParams.get('sort') || '',
  });

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const queryParams = searchParams.toString();
      const { data } = await api.get(`/properties?${queryParams}`);
      setProperties(data.properties || []);
      setPagination({ page: data.page || 1, pages: data.pages || 1, total: data.totalProperties || 0 });
    } catch (error) {
      console.error('Error fetching properties', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFilters({
      keyword: searchParams.get('keyword') || '',
      type: searchParams.get('type') || '',
      category: searchParams.get('category') || '',
      city: searchParams.get('city') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      bedrooms: searchParams.get('bedrooms') || '',
      sort: searchParams.get('sort') || '',
    });
    fetchProperties();
    // eslint-disable-next-line
  }, [searchParams]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = (e) => {
    e.preventDefault();
    const activeFilters = {};
    Object.keys(filters).forEach(key => {
      if (filters[key]) activeFilters[key] = filters[key];
    });
    setSearchParams({ ...activeFilters, page: '1' });
  };

  const clearFilters = () => {
    setFilters({ keyword: '', type: '', category: '', city: '', minPrice: '', maxPrice: '', bedrooms: '', sort: '' });
    setSearchParams({});
  };

  const changePage = (page) => {
    if (page < 1 || page > pagination.pages) return;
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(page));
    setSearchParams(nextParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
      
      {/* Sidebar Filters */}
      <aside className="w-full md:w-1/4 md:sticky md:top-28 h-fit">
        <div className="bg-white border border-stone p-6 rounded-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-stone pb-4">
            <Filter size={20} className="text-terracotta" />
            <h2 className="font-serif text-xl font-medium">Refine Search</h2>
          </div>
          
          <form onSubmit={applyFilters} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Search Keyword</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="keyword"
                  value={filters.keyword}
                  onChange={handleFilterChange}
                  placeholder="Location, landmark..." 
                  className="w-full pl-9 pr-4 py-2 border border-stone focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none bg-cream-dark/30 rounded-sm text-sm"
                />
                <Search size={16} className="absolute left-3 top-2.5 text-charcoal-muted" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Purpose</label>
              <select 
                name="type" 
                value={filters.type} 
                onChange={handleFilterChange}
                className="w-full p-2 border border-stone focus:border-terracotta outline-none bg-cream-dark/30 rounded-sm text-sm"
              >
                <option value="">All</option>
                <option value="Buy">Buy</option>
                <option value="Rent">Rent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Property Type</label>
              <select 
                name="category" 
                value={filters.category} 
                onChange={handleFilterChange}
                className="w-full p-2 border border-stone focus:border-terracotta outline-none bg-cream-dark/30 rounded-sm text-sm"
              >
                <option value="">All Categories</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Land">Land</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">City</label>
              <input 
                type="text" 
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                placeholder="e.g. Kathmandu" 
                className="w-full p-2 border border-stone focus:border-terracotta outline-none bg-cream-dark/30 rounded-sm text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Min price</label>
                <input type="number" min="0" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="NPR" className="w-full p-2 border border-stone focus:border-terracotta outline-none bg-cream-dark/30 rounded-sm text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Max price</label>
                <input type="number" min="0" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="NPR" className="w-full p-2 border border-stone focus:border-terracotta outline-none bg-cream-dark/30 rounded-sm text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Minimum bedrooms</label>
              <select name="bedrooms" value={filters.bedrooms} onChange={handleFilterChange} className="w-full p-2 border border-stone focus:border-terracotta outline-none bg-cream-dark/30 rounded-sm text-sm">
                <option value="">Any number</option>
                <option value="1">1+ bedroom</option>
                <option value="2">2+ bedrooms</option>
                <option value="3">3+ bedrooms</option>
                <option value="4">4+ bedrooms</option>
                <option value="5">5+ bedrooms</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Sort by</label>
              <select name="sort" value={filters.sort} onChange={handleFilterChange} className="w-full p-2 border border-stone focus:border-terracotta outline-none bg-cream-dark/30 rounded-sm text-sm">
                <option value="">Newest listings</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="views">Most viewed</option>
              </select>
            </div>

            <div className="pt-4 flex flex-col gap-3 border-t border-stone">
              <Button type="submit" fullWidth>Apply Filters</Button>
              <Button type="button" variant="ghost" onClick={clearFilters} fullWidth>Clear All</Button>
            </div>
          </form>
        </div>
      </aside>

      {/* Results Grid */}
      <main className="w-full md:w-3/4">
        <h1 className="text-3xl font-serif mb-8">
          Property Collection 
          <span className="text-charcoal-muted text-lg font-sans ml-3 font-normal">
            ({pagination.total} results)
          </span>
        </h1>
        
        {loading ? (
          <div className="py-20 text-center text-charcoal-muted font-serif italic">Loading collection...</div>
        ) : properties.length === 0 ? (
          <div className="py-20 text-center border border-stone bg-white rounded-sm">
            <h3 className="font-serif text-xl mb-2">No properties found</h3>
            <p className="text-charcoal-muted">Try adjusting your filters to see more results.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {properties.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
        {!loading && pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <Button type="button" variant="outline" size="sm" onClick={() => changePage(pagination.page - 1)} disabled={pagination.page === 1}>Previous</Button>
            <span className="text-sm text-charcoal-muted">Page {pagination.page} of {pagination.pages}</span>
            <Button type="button" variant="outline" size="sm" onClick={() => changePage(pagination.page + 1)} disabled={pagination.page === pagination.pages}>Next</Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Properties;