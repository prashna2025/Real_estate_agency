import React, { useState, useEffect } from 'react';
import { CalendarDays } from 'lucide-react';
import { api } from '../../services/api';

const STATUS_COLORS = {
  Pending:   'bg-yellow-100 text-yellow-800',
  Confirmed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/appointments');
        setAppointments(data);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/appointments/${id}/status`, { status });
      setAppointments((prev) => prev.map((a) => (a._id === id ? { ...a, status: data.status } : a)));
    } catch { alert('Could not update status.'); }
  };

  if (loading) return <p className="font-serif italic text-charcoal-muted">Loading appointments...</p>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl mb-1">Appointments</h1>
        <p className="text-charcoal-muted text-sm">Manage all property visit bookings.</p>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white border border-stone rounded-sm p-12 text-center">
          <CalendarDays size={40} className="text-stone mx-auto mb-4" />
          <p className="font-serif text-xl mb-2">No appointments yet</p>
          <p className="text-charcoal-muted text-sm">Bookings from property pages will appear here.</p>
        </div>
      ) : (
        <div className="bg-white border border-stone rounded-sm divide-y divide-stone">
          {appointments.map((appt) => (
            <div key={appt._id} className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <p className="font-medium">{appt.name}</p>
                  <span className={`text-xs font-semibold px-3 py-0.5 rounded-full ${STATUS_COLORS[appt.status]}`}>{appt.status}</span>
                </div>
                <p className="text-charcoal-muted text-sm">{appt.email} &middot; {appt.phone}</p>
                {appt.propertyId && (
                  <p className="text-terracotta text-sm mt-1">
                    {appt.propertyId.title} — {appt.propertyId.city}
                  </p>
                )}
                <p className="text-charcoal-muted text-xs mt-1">{appt.date} at {appt.time}</p>
                {appt.message && <p className="text-charcoal-muted text-xs mt-1 italic">"{appt.message}"</p>}
              </div>
              {appt.status === 'Pending' && (
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleStatus(appt._id, 'Confirmed')}
                    className="text-xs bg-green-100 text-green-800 px-3 py-1.5 rounded-sm hover:bg-green-200 transition-colors font-medium"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleStatus(appt._id, 'Cancelled')}
                    className="text-xs bg-red-50 text-red-700 px-3 py-1.5 rounded-sm hover:bg-red-100 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageAppointments;
