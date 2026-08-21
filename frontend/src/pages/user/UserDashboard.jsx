import React from 'react';
import { Heart, Calendar, Settings, MessageSquare } from 'lucide-react';

const UserDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12 min-h-screen">
      
      {/* Client Sidebar */}
      <aside className="w-full md:w-1/4 md:border-r border-stone pr-6">
        <h2 className="font-serif text-2xl mb-8 text-charcoal">Client Portal</h2>
        <nav className="space-y-4 text-sm font-medium">
          <button className="w-full flex items-center gap-3 text-terracotta">
            <Heart size={18}/> Curated Wishlist
          </button>
          <button className="w-full flex items-center gap-3 text-charcoal-muted hover:text-terracotta transition-colors">
            <Calendar size={18}/> Viewing Itinerary
          </button>
          <button className="w-full flex items-center gap-3 text-charcoal-muted hover:text-terracotta transition-colors">
            <MessageSquare size={18}/> Concierge Messages
          </button>
          <button className="w-full flex items-center gap-3 text-charcoal-muted hover:text-terracotta transition-colors">
            <Settings size={18}/> Preferences
          </button>
        </nav>
      </aside>
      
      {/* Main Content Area */}
      <main className="w-full md:w-3/4">
        <h3 className="font-serif text-3xl mb-2">Saved Collection</h3>
        <p className="text-charcoal-muted text-sm mb-8">Properties you are currently considering.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Saved Property Cards will be mapped here */}
          <div className="col-span-1 lg:col-span-2 py-20 border border-stone bg-white text-center rounded-sm">
            <p className="text-charcoal-muted font-serif text-lg italic">Your collection is empty.</p>
            <p className="text-sm text-charcoal mt-2">Explore our listings to find your next space.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;