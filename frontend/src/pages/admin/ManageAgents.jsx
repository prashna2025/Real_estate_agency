import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, BadgeCheck, Pencil, X, Check } from 'lucide-react';
import { api } from '../../services/api';
import Button from '../../components/common/Button';

const EMPTY_FORM = { name: '', email: '', password: '', phone: '', bio: '', specialization: '' };

const ManageAgents = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchTeam = async () => {
    try {
      const { data } = await api.get('/admin/team');
      setTeam(data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTeam(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      const { data } = await api.post('/admin/team', form);
      setTeam((prev) => [...prev, data]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not create agent.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this agent?')) return;
    try {
      await api.delete(`/admin/team/${id}`);
      setTeam((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete agent.');
    }
  };

  const startEdit = (member) => {
    setEditingId(member._id);
    setEditForm({ name: member.name, bio: member.bio || '', phone: member.phone || '', specialization: member.specialization || '', isVerified: member.isVerified });
  };

  const handleUpdate = async (id) => {
    try {
      const { data } = await api.put(`/admin/team/${id}`, editForm);
      setTeam((prev) => prev.map((m) => (m._id === id ? { ...m, ...data } : m)));
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update agent.');
    }
  };

  if (loading) return <p className="font-serif italic text-charcoal-muted">Loading team...</p>;

  const agents = team.filter((m) => m.role === 'Agent');
  const admins = team.filter((m) => m.role === 'Admin');

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl mb-1">Team Management</h1>
          <p className="text-charcoal-muted text-sm">Manage admin accounts and agent profiles.</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : <><UserPlus size={16} className="inline mr-1" />Add Agent</>}
        </Button>
      </div>

      {/* Create Agent Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-stone p-8 rounded-sm mb-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          <h2 className="font-serif text-xl md:col-span-2">New Agent</h2>
          {[
            { label: 'Full Name *', key: 'name', type: 'text' },
            { label: 'Email *', key: 'email', type: 'email' },
            { label: 'Password *', key: 'password', type: 'password' },
            { label: 'Phone', key: 'phone', type: 'tel' },
            { label: 'Specialization', key: 'specialization', type: 'text' },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <input
                type={type}
                required={label.includes('*')}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full p-3 border border-stone focus:border-terracotta outline-none rounded-sm text-sm"
              />
            </div>
          ))}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea rows="3" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="w-full p-3 border border-stone focus:border-terracotta outline-none rounded-sm text-sm resize-none" />
          </div>
          {formError && <p className="md:col-span-2 text-red-500 text-sm">{formError}</p>}
          <div className="md:col-span-2">
            <Button type="submit">Create Agent</Button>
          </div>
        </form>
      )}

      {/* Admins */}
      <section className="mb-10">
        <h2 className="font-serif text-xl mb-4">Admins <span className="text-charcoal-muted text-sm font-sans ml-2">({admins.length})</span></h2>
        <div className="bg-white border border-stone rounded-sm divide-y divide-stone">
          {admins.map((m) => (
            <div key={m._id} className="px-6 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{m.name}</p>
                <p className="text-charcoal-muted text-sm">{m.email}</p>
              </div>
              <span className="text-xs bg-cream-dark px-3 py-1 rounded-full font-medium text-charcoal">Admin</span>
            </div>
          ))}
        </div>
      </section>

      {/* Agents */}
      <section>
        <h2 className="font-serif text-xl mb-4">Agents <span className="text-charcoal-muted text-sm font-sans ml-2">({agents.length})</span></h2>
        {agents.length === 0 ? (
          <div className="bg-white border border-stone rounded-sm p-8 text-center text-charcoal-muted text-sm">
            No agents yet. Click "Add Agent" to create one.
          </div>
        ) : (
          <div className="bg-white border border-stone rounded-sm divide-y divide-stone">
            {agents.map((m) => (
              <div key={m._id} className="px-6 py-4">
                {editingId === m._id ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: 'Name', key: 'name' },
                      { label: 'Phone', key: 'phone' },
                      { label: 'Specialization', key: 'specialization' },
                    ].map(({ label, key }) => (
                      <div key={key}>
                        <label className="block text-xs font-medium mb-1 text-charcoal-muted">{label}</label>
                        <input
                          value={editForm[key] || ''}
                          onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                          className="w-full p-2 border border-stone focus:border-terracotta outline-none rounded-sm text-sm"
                        />
                      </div>
                    ))}
                    <div className="md:col-span-3">
                      <label className="block text-xs font-medium mb-1 text-charcoal-muted">Bio</label>
                      <textarea rows="2" value={editForm.bio || ''} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} className="w-full p-2 border border-stone focus:border-terracotta outline-none rounded-sm text-sm resize-none" />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id={`verified-${m._id}`} checked={editForm.isVerified || false} onChange={(e) => setEditForm({ ...editForm, isVerified: e.target.checked })} />
                      <label htmlFor={`verified-${m._id}`} className="text-sm">Verified agent</label>
                    </div>
                    <div className="md:col-span-3 flex gap-3">
                      <button onClick={() => handleUpdate(m._id)} className="inline-flex items-center gap-1 text-sm bg-terracotta text-white px-4 py-2 rounded-sm hover:opacity-90 transition-opacity"><Check size={14} /> Save</button>
                      <button onClick={() => setEditingId(null)} className="inline-flex items-center gap-1 text-sm border border-stone px-4 py-2 rounded-sm hover:border-charcoal transition-colors"><X size={14} /> Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-medium">{m.name}</p>
                        {m.isVerified && <BadgeCheck size={15} className="text-terracotta" />}
                      </div>
                      <p className="text-charcoal-muted text-sm">{m.email} {m.specialization && <span className="ml-2 text-xs bg-cream-dark px-2 py-0.5 rounded-full">{m.specialization}</span>}</p>
                      {m.bio && <p className="text-charcoal-muted text-xs mt-1 line-clamp-1">{m.bio}</p>}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => startEdit(m)} title="Edit" className="p-2 border border-stone rounded-sm hover:border-terracotta text-charcoal-muted hover:text-terracotta transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(m._id)} title="Delete" className="p-2 border border-stone rounded-sm hover:border-red-400 text-charcoal-muted hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ManageAgents;
