import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, BedDouble, Bath, Square, CheckCircle, ArrowLeft } from 'lucide-react';
import { api, getImageUrl } from '../../services/api';
import Button from '../../components/common/Button';

const PropertyDetail = () => {
  const { slug } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: 'I am interested in this property and would like to schedule a viewing.' });
  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: '' });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await api.get(`/properties/${slug}`);
        setProperty(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [slug]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, success: false, error: '' });
    try {
      await api.post('/inquiries', { ...formData, propertyId: property._id });
      setFormStatus({ loading: false, success: true, error: '' });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setFormStatus({ loading: false, success: false, error: error.response?.data?.message || 'Something went wrong.' });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-serif text-xl italic">Loading property details...</div>;
  if (!property) return <div className="min-h-screen flex items-center justify-center font-serif text-xl">Property not found.</div>;

  const images = Array.isArray(property.images) ? property.images : [];

  const formatPrice = (price) => new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(price);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Link to="/properties" className="inline-flex items-center text-charcoal-muted hover:text-terracotta mb-8 transition-colors text-sm font-medium">
        <ArrowLeft size={16} className="mr-2" /> Back to Properties
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Col: Gallery & Details */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Main Gallery */}
          <div className="space-y-4">
            <div className="aspect-video bg-stone overflow-hidden rounded-sm">
              <img 
                src={getImageUrl(images[activeImage])} 
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                {images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square overflow-hidden rounded-sm border-2 transition-colors ${activeImage === idx ? 'border-terracotta' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={getImageUrl(img)} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Header Info */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <span className="bg-white border border-stone px-3 py-1 text-xs font-semibold uppercase tracking-wider text-charcoal rounded-sm shadow-sm">
                For {property.type}
              </span>
              <h2 className="text-3xl font-serif text-terracotta">{formatPrice(property.price)}</h2>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif mb-4 leading-tight">{property.title}</h1>
            <div className="flex items-center text-charcoal-muted text-lg">
              <MapPin size={18} className="mr-2 text-terracotta" />
              {property.location}, {property.city}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-stone">
            <div className="flex flex-col">
              <span className="text-charcoal-muted text-sm mb-1">Bedrooms</span>
              <span className="font-serif text-xl flex items-center gap-2"><BedDouble size={20} className="text-terracotta"/> {property.bedrooms}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-charcoal-muted text-sm mb-1">Bathrooms</span>
              <span className="font-serif text-xl flex items-center gap-2"><Bath size={20} className="text-terracotta"/> {property.bathrooms}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-charcoal-muted text-sm mb-1">Area</span>
              <span className="font-serif text-xl flex items-center gap-2"><Square size={20} className="text-terracotta"/> {property.area} sq.ft</span>
            </div>
            <div className="flex flex-col">
              <span className="text-charcoal-muted text-sm mb-1">Property Type</span>
              <span className="font-serif text-xl">{property.category}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-2xl font-serif mb-4">About this property</h3>
            <div className="prose prose-stone max-w-none text-charcoal whitespace-pre-line leading-relaxed">
              {property.description}
            </div>
          </div>
        </div>

        {/* Right Col: Sticky Inquiry Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-stone p-8 rounded-sm sticky top-28 shadow-sm">
            <h3 className="font-serif text-2xl mb-2">Interested?</h3>
            <p className="text-charcoal-muted text-sm mb-6">Contact our agents to arrange a private viewing.</p>

            {formStatus.success ? (
              <div className="bg-cream-dark p-6 text-center rounded-sm border border-stone">
                <CheckCircle size={40} className="text-terracotta mx-auto mb-4" />
                <h4 className="font-serif text-lg mb-2">Inquiry Sent</h4>
                <p className="text-sm text-charcoal-muted">Our advisory team will reach out to you shortly to discuss next steps.</p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-stone focus:border-terracotta outline-none rounded-sm text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 border border-stone focus:border-terracotta outline-none rounded-sm text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 border border-stone focus:border-terracotta outline-none rounded-sm text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea required rows="4" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full p-3 border border-stone focus:border-terracotta outline-none rounded-sm text-sm resize-none" />
                </div>
                
                {formStatus.error && <p className="text-red-500 text-sm">{formStatus.error}</p>}
                
                <Button type="submit" fullWidth disabled={formStatus.loading}>
                  {formStatus.loading ? 'Sending...' : 'Request Viewing'}
                </Button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PropertyDetail;