import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Home, Mail, Star, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/dashboard-stats');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="font-serif italic text-charcoal-muted">Loading dashboard...</div>;

  const statCards = [
    { title: 'Total Properties', value: stats.totalProperties, icon: Home, color: 'text-charcoal' },
    { title: 'Active Inquiries', value: stats.totalInquiries, icon: Mail, color: 'text-terracotta' },
    { title: 'Featured Listings', value: stats.featuredProperties, icon: Star, color: 'text-[#D4AF37]' },
    { title: 'Available Units', value: stats.breakdown.available, icon: TrendingUp, color: 'text-green-600' },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white border border-stone p-6 rounded-sm flex items-start justify-between">
            <div>
              <p className="text-charcoal-muted text-sm mb-1 font-medium">{stat.title}</p>
              <h3 className="font-serif text-3xl text-charcoal">{stat.value}</h3>
            </div>
            <div className={`p-3 bg-cream rounded-sm ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-stone rounded-sm p-6">
        <h2 className="font-serif text-xl mb-4">Recent Inquiries</h2>
        {stats.recentInquiries.length === 0 ? (
          <p className="text-charcoal-muted text-sm">No recent inquiries.</p>
        ) : (
          <div className="divide-y divide-stone">
            {stats.recentInquiries.map(inquiry => (
              <div key={inquiry._id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-charcoal">{inquiry.name} <span className="text-charcoal-muted font-normal text-sm ml-2">{inquiry.email}</span></p>
                  <p className="text-sm text-terracotta mt-1">Re: {inquiry.propertyId?.title}</p>
                </div>
                <span className="text-xs bg-cream-dark px-2 py-1 rounded-sm text-charcoal-muted uppercase tracking-wider">{inquiry.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;