import React from 'react';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import AgentCard from './AgentCard';
import Button from '../../components/common/Button';

const agents = [
  {
    name: 'Aarav Shrestha',
    bio: 'Residential specialist for Kathmandu Valley homes',
    isVerified: true,
    rating: 4.9,
    reviews: [{}, {}, {}, {}, {}],
  },
  {
    name: 'Maya Gurung',
    bio: 'Thoughtful guidance for first-time buyers',
    isVerified: true,
    rating: 4.8,
    reviews: [{}, {}, {}, {}],
  },
  {
    name: 'Rohan Thapa',
    bio: 'Commercial property and investment advisor',
    isVerified: true,
    rating: 4.7,
    reviews: [{}, {}, {}, {}, {}, {}],
  },
];

const Agents = () => {
  return (
    <div>
      <section className="bg-charcoal text-cream py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-terracotta uppercase tracking-[0.2em] text-xs font-semibold mb-4">Your local advantage</p>
          <h1 className="font-serif text-4xl md:text-6xl max-w-3xl leading-tight">People who know where you belong.</h1>
          <p className="mt-6 text-cream/70 text-lg max-w-2xl leading-relaxed">
            Meet the advisors behind every considered move. Our team brings local knowledge, market context, and a calm perspective to the search.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {agents.map((agent) => <AgentCard key={agent.name} agent={agent} />)}
        </div>

        <div className="mt-20 border-t border-stone pt-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-3xl mb-2">Have a property in mind?</h2>
            <p className="text-charcoal-muted">Start a conversation with the right advisor for your search.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/contact">
              <Button>Get in touch <ArrowRight size={17} className="ml-2" /></Button>
            </Link>
            <a href="mailto:hello@boutiqueestate.com" className="inline-flex items-center gap-2 px-4 py-2 text-sm text-charcoal-muted hover:text-terracotta transition-colors">
              <Mail size={16} /> Email us
            </a>
            <a href="tel:+97714000000" className="inline-flex items-center gap-2 px-4 py-2 text-sm text-charcoal-muted hover:text-terracotta transition-colors">
              <Phone size={16} /> Call office
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Agents;