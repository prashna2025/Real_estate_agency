import React from 'react';
import { BadgeCheck, Star } from 'lucide-react';

const AgentCard = ({ agent }) => {
  return (
    <div className="border border-stone bg-white p-6 rounded-sm text-center group hover:border-terracotta transition-colors">
      <div className="w-24 h-24 mx-auto bg-cream-dark rounded-sm mb-4 overflow-hidden relative">
        <img 
          src={`https://ui-avatars.com/api/?name=${agent.name}&background=1E1E1E&color=FAF8F5`} 
          alt={agent.name} 
          className="w-full h-full object-cover" 
        />
      </div>
      <h3 className="font-serif text-xl flex items-center justify-center gap-2">
        {agent.name}
        {agent.isVerified && <BadgeCheck size={18} className="text-[#D4AF37]" title="Verified Agent" />}
      </h3>
      <p className="text-charcoal-muted text-sm mt-1">{agent.bio || 'Real Estate Advisor'}</p>
      
      <div className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-charcoal">
        <Star size={16} className="text-[#D4AF37] fill-[#D4AF37]" />
        {agent.rating ? agent.rating.toFixed(1) : 'New'} 
        <span className="text-charcoal-muted font-normal">({agent.reviews?.length || 0} reviews)</span>
      </div>
    </div>
  );
};

export default AgentCard;