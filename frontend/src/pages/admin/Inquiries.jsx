import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

const statuses = ['New', 'Contacted', 'Resolved'];

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/inquiries');
      setInquiries(data || []);
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInquiries(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/inquiries/${id}/status`, { status });
      setInquiries((current) => current.map((inquiry) => inquiry._id === id ? { ...inquiry, status } : inquiry));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not update inquiry status.');
    }
  };

  const visibleInquiries = filter === 'All' ? inquiries : inquiries.filter((inquiry) => inquiry.status === filter);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div><h1 className="font-serif text-3xl mb-2">Inquiries</h1><p className="text-charcoal-muted">Track and follow up with prospective clients.</p></div>
        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="border border-stone bg-white px-3 py-2 text-sm rounded-sm">
          <option value="All">All inquiries ({inquiries.length})</option>
          {statuses.map((status) => <option key={status} value={status}>{status} ({inquiries.filter((inquiry) => inquiry.status === status).length})</option>)}
        </select>
      </div>
      {error && <div className="border border-red-200 bg-red-50 p-4 mb-6 text-sm text-red-700">{error}</div>}
      {loading ? <p className="font-serif italic text-charcoal-muted">Loading inquiries...</p> : visibleInquiries.length === 0 ? (
        <div className="bg-white border border-stone p-10 text-center text-charcoal-muted">No inquiries in this view.</div>
      ) : (
        <div className="bg-white border border-stone rounded-sm overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="border-b border-stone bg-cream-dark/40"><tr><th className="p-4 text-xs uppercase tracking-wider text-charcoal-muted">Client</th><th className="p-4 text-xs uppercase tracking-wider text-charcoal-muted">Property</th><th className="p-4 text-xs uppercase tracking-wider text-charcoal-muted">Inquiry</th><th className="p-4 text-xs uppercase tracking-wider text-charcoal-muted">Status</th></tr></thead>
            <tbody>{visibleInquiries.map((inquiry) => <tr key={inquiry._id} className="border-b border-stone last:border-0 align-top"><td className="p-4"><p className="font-medium">{inquiry.name}</p><a href={`mailto:${inquiry.email}`} className="text-sm text-terracotta hover:underline">{inquiry.email}</a><p className="text-sm text-charcoal-muted">{inquiry.phone}</p></td><td className="p-4 text-sm">{inquiry.propertyId ? <Link to={`/property/${inquiry.propertyId.slug}`} target="_blank" className="text-terracotta hover:underline">{inquiry.propertyId.title}</Link> : 'General inquiry'}</td><td className="p-4 max-w-sm text-sm"><p className="font-medium text-charcoal">{inquiry.subject || 'Property inquiry'}</p><p className="text-charcoal-muted mt-1">{inquiry.message}</p><p className="text-xs text-charcoal-muted mt-2">Preferred: {inquiry.preferredContactTime || 'Any time'}</p></td><td className="p-4"><select value={inquiry.status} onChange={(event) => updateStatus(inquiry._id, event.target.value)} className="border border-stone bg-cream px-2 py-2 text-sm rounded-sm">{statuses.map((status) => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Inquiries;