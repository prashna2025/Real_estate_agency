import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const UserAuth = () => {
  const isRegistering = useLocation().pathname.endsWith('/register');
  const navigate = useNavigate();
  const { userLogin, userRegister } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isRegistering) {
        await userRegister(form.name, form.email, form.password);
      } else {
        await userLogin(form.email, form.password);
      }
      navigate('/favorites');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to complete your request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <div className="text-center mb-10">
        <UserRound className="mx-auto text-terracotta mb-4" size={28} />
        <h1 className="font-serif text-4xl mb-3">{isRegistering ? 'Create your account' : 'Welcome back'}</h1>
        <p className="text-charcoal-muted">Save properties and keep your search in one place.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-stone p-8 space-y-5">
        {isRegistering && (
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">Full name</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} required minLength="2" className="w-full p-3 border border-stone bg-cream-dark/30 outline-none focus:border-terracotta" />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className="w-full p-3 border border-stone bg-cream-dark/30 outline-none focus:border-terracotta" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required minLength="6" className="w-full p-3 border border-stone bg-cream-dark/30 outline-none focus:border-terracotta" />
        </div>
        {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
        <Button type="submit" fullWidth disabled={submitting}>{submitting ? 'Please wait...' : (isRegistering ? 'Create account' : 'Sign in')}</Button>
      </form>

      <p className="text-center text-sm text-charcoal-muted mt-6">
        {isRegistering ? 'Already have an account?' : 'New to BoutiqueEstate?'}{' '}
        <Link className="text-terracotta font-medium" to={isRegistering ? '/login' : '/register'}>{isRegistering ? 'Sign in' : 'Create an account'}</Link>
      </p>
    </div>
  );
};

export default UserAuth;