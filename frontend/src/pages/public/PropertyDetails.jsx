import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, BedDouble, Bath, Square, CheckCircle, ArrowLeft, Heart, CalendarDays } from 'lucide-react';
import { api, getImageUrl } from '../../services/api';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import useRecentlyViewed from '../../hooks/useRecentlyViewed';

const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

const PropertyDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('inquiry'); // 'inquiry' | 'booking'
  const { isFavorite, toggleFavorite } = useFavorites();

  // Inquiry Form State
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: 'I am interested in this property and would like to schedule a viewing.' });
  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: '' });

  // Booking Form State
  const [bookData, setBookData] = useState({ name: user?.name || '', email: user?.email || '', phone: '', date: '', time: '', message: '' });
  const [bookStatus, setBookStatus] = useState({ loading: false, success: false, error: '' });

  const { addRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await api.get(`/properties/${slug}`);
        setProperty(data);
        addRecentlyViewed(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [slug]);

  // Pre-fill booking form when user logs in
  useEffect(() => {
    if (user) {
      setBookData((prev) => ({ ...prev, name: user.name || '', email: user.email || '' }));
    }
  }, [user]);

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

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookStatus({ loading: true, success: false, error: '' });
    try {
      await api.post('/appointments', { ...bookData, propertyId: property._id });
      setBookStatus({ loading: false, success: true, error: '' });
      setBookData({ name: user?.name || '', email: user?.email || '', phone: '', date: '', time: '', message: '' });
    } catch (error) {
      setBookStatus({ loading: false, success: false, error: error.response?.data?.message || 'Something went wrong.' });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-serif text-xl italic">Loading property details...</div>;
  if (!property) return <div className="min-h-screen flex items-center justify-center font-serif text-xl">Property not found.</div>;

  const images = Array.isArray(property.images) ? property.images : [];
  const formatPrice = (price) => new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(price);

  // Min date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

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
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => toggleFavorite(property)}
                  className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${isFavorite(property._id) ? "text-terracotta" : "text-charcoal-muted hover:text-terracotta"}`}
                >
                  <Heart size={18} fill={isFavorite(property._id) ? 'currentColor' : 'none'} /> 
                  {isFavorite(property._id) ? 'Saved' : 'Save Property'}
                </button>
                <h2 className="text-3xl font-serif text-terracotta">{formatPrice(property.price)}</h2>
              </div>
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

        {/* Right Col: Sticky Tabs (Inquiry / Book a Visit) */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-stone rounded-sm sticky top-28 shadow-sm overflow-hidden">
            {/* Tab Headers */}
            <div className="flex border-b border-stone">
              <button
                onClick={() => setActiveTab('inquiry')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'inquiry' ? 'text-terracotta border-b-2 border-terracotta' : 'text-charcoal-muted hover:text-charcoal'}`}
              >
                Inquire
              </button>
              <button
                onClick={() => setActiveTab('booking')}
                className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'booking' ? 'text-terracotta border-b-2 border-terracotta' : 'text-charcoal-muted hover:text-charcoal'}`}
              >
                <CalendarDays size={15} /> Book a Visit
              </button>
            </div>

            <div className="p-8">
              {/* Inquiry Tab */}
              {activeTab === 'inquiry' && (
                <>
                  <h3 className="font-serif text-xl mb-2">Interested?</h3>
                  <p className="text-charcoal-muted text-sm mb-5">Contact our agents to arrange a private viewing.</p>
                  {formStatus.success ? (
                    <div className="bg-cream-dark p-6 text-center rounded-sm border border-stone">
                      <CheckCircle size={40} className="text-terracotta mx-auto mb-4" />
                      <h4 className="font-serif text-lg mb-2">Inquiry Sent</h4>
                      <p className="text-sm text-charcoal-muted">Our advisory team will reach out to you shortly.</p>
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
                </>
              )}

              {/* Book a Visit Tab */}
              {activeTab === 'booking' && (
                <>
                  <h3 className="font-serif text-xl mb-2">Book a Visit</h3>
                  <p className="text-charcoal-muted text-sm mb-5">Schedule a time to visit this property in person.</p>
                  {bookStatus.success ? (
                    <div className="bg-cream-dark p-6 text-center rounded-sm border border-stone">
                      <CheckCircle size={40} className="text-terracotta mx-auto mb-4" />
                      <h4 className="font-serif text-lg mb-2">Visit Booked!</h4>
                      <p className="text-sm text-charcoal-muted">We'll confirm your appointment soon.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleBookingSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input required type="text" value={bookData.name} onChange={e => setBookData({...bookData, name: e.target.value})} className="w-full p-3 border border-stone focus:border-terracotta outline-none rounded-sm text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input required type="email" value={bookData.email} onChange={e => setBookData({...bookData, email: e.target.value})} className="w-full p-3 border border-stone focus:border-terracotta outline-none rounded-sm text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone</label>
                        <input required type="tel" value={bookData.phone} onChange={e => setBookData({...bookData, phone: e.target.value})} className="w-full p-3 border border-stone focus:border-terracotta outline-none rounded-sm text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Preferred Date</label>
                        <input required type="date" min={minDate} value={bookData.date} onChange={e => setBookData({...bookData, date: e.target.value})} className="w-full p-3 border border-stone focus:border-terracotta outline-none rounded-sm text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Preferred Time</label>
                        <select required value={bookData.time} onChange={e => setBookData({...bookData, time: e.target.value})} className="w-full p-3 border border-stone focus:border-terracotta outline-none rounded-sm text-sm bg-white">
                          <option value="">Select a time slot</option>
                          {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Message (optional)</label>
                        <textarea rows="2" value={bookData.message} onChange={e => setBookData({...bookData, message: e.target.value})} className="w-full p-3 border border-stone focus:border-terracotta outline-none rounded-sm text-sm resize-none" />
                      </div>
                      {bookStatus.error && <p className="text-red-500 text-sm">{bookStatus.error}</p>}
                      <Button type="submit" fullWidth disabled={bookStatus.loading}>
                        {bookStatus.loading ? 'Booking...' : 'Confirm Visit'}
                      </Button>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PropertyDetail;