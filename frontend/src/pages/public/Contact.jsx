import React, { useState } from 'react';
import { CheckCircle, Mail, MapPin, Phone } from 'lucide-react';
import { api } from '../../services/api';
import Button from '../../components/common/Button';

const initialForm = { name: '', email: '', phone: '', message: '' };

const Contact = () => {
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      await api.post('/inquiries', formData);
      setFormData(initialForm);
      setStatus({ loading: false, success: true, error: '' });
    } catch (error) {
      setStatus({
        loading: false,
        success: false,
        error: error.response?.data?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        <div>
          <p className="text-terracotta uppercase tracking-[0.2em] text-xs font-semibold mb-4">Start a conversation</p>
          <h1 className="font-serif text-4xl md:text-6xl leading-tight mb-6">Let&apos;s find your next place.</h1>
          <p className="text-charcoal-muted text-lg leading-relaxed max-w-lg mb-10">
            Tell us what you are looking for, and one of our advisors will get back to you with thoughtful next steps.
          </p>

          <div className="space-y-5 text-charcoal-muted">
            <a href="mailto:hello@boutiqueestate.com" className="flex items-center gap-3 hover:text-terracotta transition-colors"><Mail size={18} /> hello@boutiqueestate.com</a>
            <a href="tel:+97714000000" className="flex items-center gap-3 hover:text-terracotta transition-colors"><Phone size={18} /> +977 1-4000000</a>
            <div className="flex items-center gap-3"><MapPin size={18} /> Kathmandu, Nepal</div>
          </div>
        </div>

        <div className="bg-white border border-stone p-7 md:p-9 rounded-sm">
          {status.success ? (
            <div className="py-12 text-center">
              <CheckCircle size={44} className="text-terracotta mx-auto mb-4" />
              <h2 className="font-serif text-2xl mb-2">Message received</h2>
              <p className="text-charcoal-muted text-sm">Our advisory team will be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium mb-1">Full Name</label>
                <input id="contact-name" name="name" required value={formData.name} onChange={handleChange} className="w-full p-3 border border-stone focus:border-terracotta outline-none rounded-sm text-sm" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium mb-1">Email Address</label>
                  <input id="contact-email" name="email" required type="email" value={formData.email} onChange={handleChange} className="w-full p-3 border border-stone focus:border-terracotta outline-none rounded-sm text-sm" />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-medium mb-1">Phone Number</label>
                  <input id="contact-phone" name="phone" required type="tel" value={formData.phone} onChange={handleChange} className="w-full p-3 border border-stone focus:border-terracotta outline-none rounded-sm text-sm" />
                </div>
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium mb-1">How can we help?</label>
                <textarea id="contact-message" name="message" required minLength="5" rows="6" value={formData.message} onChange={handleChange} className="w-full p-3 border border-stone focus:border-terracotta outline-none rounded-sm text-sm resize-none" />
              </div>
              {status.error && <p className="text-red-500 text-sm">{status.error}</p>}
              <Button type="submit" fullWidth disabled={status.loading}>{status.loading ? 'Sending...' : 'Send inquiry'}</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;