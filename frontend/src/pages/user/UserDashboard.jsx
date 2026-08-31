import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Heart, UserRound, CalendarDays, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import PropertyCard from '../../components/common/PropertyCard';
import useRecentlyViewed from '../../hooks/useRecentlyViewed';
import { api } from '../../services/api';

const STATUS_COLORS = {
  Pending:   'bg-yellow-100 text-yellow-800',
  Confirmed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const UserDashboard = () => {
  const { user, updateUserProfile } = useAuth();
  const { recentlyViewed } = useRecentlyViewed();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'appointments'
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Appointments state
  const [appointments, setAppointments] = useState([]);
  const [apptLoading, setApptLoading] = useState(false);

  if (!user) return <Navigate to="/login" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    try {
      await updateUserProfile(form);
      setMessage('Profile updated successfully.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update your profile.');
    }
  };

  const fetchAppointments = async () => {
    setApptLoading(true);
    try {
      const { data } = await api.get('/appointments/mine');
      setAppointments(data);
    } catch {
      // guest or error — just show empty
    } finally {
      setApptLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.patch(`/appointments/${id}/cancel`);
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: 'Cancelled' } : a))
      );
    } catch {
      alert('Could not cancel appointment.');
    }
  };

  // Load appointments when tab opens
  useEffect(() => {
    if (activeTab === 'appointments') {
      fetchAppointments();
    }
  }, [activeTab]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <p className="text-terracotta text-sm font-medium uppercase tracking-widest mb-2">Client portal</p>
          <h1 className="font-serif text-4xl">Your account</h1>
        </div>
        <Link to="/favorites" className="inline-flex items-center gap-2 text-terracotta font-medium"><Heart size={18} /> View saved properties</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12">
        {/* Sidebar */}
        <aside className="border-b lg:border-b-0 lg:border-r border-stone pb-6 lg:pb-0 space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium transition-colors ${activeTab === 'profile' ? 'text-terracotta bg-cream-dark' : 'text-charcoal hover:text-terracotta'}`}
          >
            <UserRound size={18} /> Profile details
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium transition-colors ${activeTab === 'appointments' ? 'text-terracotta bg-cream-dark' : 'text-charcoal hover:text-terracotta'}`}
          >
            <CalendarDays size={18} /> My Appointments
          </button>
        </aside>

        {/* Main Content */}
        <main>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="max-w-xl">
              <h2 className="font-serif text-2xl mb-2">Personal information</h2>
              <p className="text-charcoal-muted text-sm mb-8">Keep your contact details current for property inquiries.</p>
              <form onSubmit={handleSubmit} className="bg-white border border-stone p-8 space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="profile-name">Full name</label>
                  <input id="profile-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required minLength="2" className="w-full p-3 border border-stone bg-cream-dark/30 outline-none focus:border-terracotta" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="profile-email">Email address</label>
                  <input id="profile-email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required className="w-full p-3 border border-stone bg-cream-dark/30 outline-none focus:border-terracotta" />
                </div>
                {message && <p className="text-sm text-green-700" role="status">{message}</p>}
                {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
                <Button type="submit">Save changes</Button>
              </form>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div>
              <h2 className="font-serif text-2xl mb-2">My Appointments</h2>
              <p className="text-charcoal-muted text-sm mb-8">Track and manage your scheduled property visits.</p>

              {apptLoading ? (
                <p className="text-charcoal-muted italic">Loading appointments...</p>
              ) : appointments.length === 0 ? (
                <div className="bg-white border border-stone p-10 text-center rounded-sm">
                  <CalendarDays size={40} className="text-stone mx-auto mb-4" />
                  <p className="font-serif text-xl mb-2">No appointments yet</p>
                  <p className="text-charcoal-muted text-sm mb-6">Book a visit on any property page.</p>
                  <Link to="/properties" className="inline-flex bg-terracotta text-white px-6 py-3 text-sm hover:bg-terracotta-hover transition-colors">
                    Browse Properties
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appt) => (
                    <div key={appt._id} className="bg-white border border-stone p-6 rounded-sm flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-grow">
                        <p className="font-serif text-lg mb-1">
                          {appt.propertyId ? (
                            <Link to={`/property/${appt.propertyId.slug}`} className="hover:text-terracotta transition-colors">
                              {appt.propertyId.title}
                            </Link>
                          ) : 'Property'}
                        </p>
                        <p className="text-charcoal-muted text-sm">
                          {appt.date} &middot; {appt.time}
                          {appt.propertyId?.city && ` &middot; ${appt.propertyId.city}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[appt.status] || 'bg-stone text-charcoal'}`}>
                          {appt.status}
                        </span>
                        {appt.status === 'Pending' && (
                          <button
                            onClick={() => handleCancel(appt._id)}
                            title="Cancel appointment"
                            className="inline-flex items-center gap-1 text-xs text-charcoal-muted hover:text-red-600 transition-colors"
                          >
                            <X size={14} /> Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {recentlyViewed.length > 0 && (
        <section className="mt-16 border-t border-stone pt-10">
          <h2 className="font-serif text-2xl mb-2">Recently viewed</h2>
          <p className="text-charcoal-muted text-sm mb-6">Pick up where your property search left off.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyViewed.map((property) => <PropertyCard key={property._id} property={property} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default UserDashboard;