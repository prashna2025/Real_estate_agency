import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import PropertyCard from '../../components/common/PropertyCard';
import Button from '../../components/common/Button';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/properties/featured');
        setFeatured(data);
      } catch (error) {
        console.error('Failed to fetch featured properties', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="w-full">
      {/* Editorial Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1920&q=80" 
            alt="Luxurious interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/30"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex justify-start">
          <div className="bg-cream p-10 md:p-16 max-w-xl border-l-4 border-terracotta shadow-2xl">
            <h1 className="text-4xl md:text-6xl font-serif text-charcoal leading-tight mb-6">
              Curated homes for the modern lifestyle.
            </h1>
            <p className="text-charcoal-muted text-lg mb-8 font-sans">
              Discover a handpicked collection of prime real estate in Nepal's most sought-after neighborhoods.
            </p>
            <Link to="/properties">
              <Button size="lg" className="group">
                Explore Collection
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties (Asymmetric Grid) */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-serif mb-4">Exclusive Listings</h2>
            <p className="text-charcoal-muted text-lg text-balance">
              Our portfolio represents the pinnacle of residential and commercial spaces, designed for those who appreciate understated elegance.
            </p>
          </div>
          <Link to="/properties" className="text-terracotta font-medium hover:text-terracotta-hover flex items-center transition-colors">
            View all properties <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-charcoal-muted font-serif italic">Curating properties...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {featured.map((property, index) => (
              <div 
                key={property._id} 
                className={index === 0 ? "lg:col-span-2 lg:row-span-2" : ""}
              >
                <PropertyCard 
                  property={property} 
                  className={index === 0 ? "h-full" : ""}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Brand Ethos Section */}
      <section className="bg-charcoal text-cream py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-serif mb-6 text-white">Not just a transaction. A transition.</h2>
            <p className="text-cream-dark/80 text-lg mb-6 leading-relaxed font-sans">
              We move away from the high-pressure sales tactics of traditional real estate. Instead, we offer advisory services grounded in market data, architectural appreciation, and your personal lifestyle goals.
            </p>
            <Button variant="outline" className="border-cream text-cream hover:bg-cream hover:text-charcoal mt-4">
              Meet Our Agents
            </Button>
          </div>
          <div className="aspect-[4/5] relative overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80" 
              alt="Architecture detail" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;