import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Heart, UserRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const UserDashboard = () => {
  const { user, updateUserProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
        <aside className="border-b lg:border-b-0 lg:border-r border-stone pb-6 lg:pb-0">
          <div className="flex items-center gap-3 text-charcoal font-medium"><UserRound size={20} className="text-terracotta" /> Profile details</div>
        </aside>
        <main className="max-w-xl">
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
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;