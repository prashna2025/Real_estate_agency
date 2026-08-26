import React, { useEffect, useState } from 'react';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import AgentCard from './AgentCard';
import Button from '../../components/common/Button';
import { api } from '../../services/api';

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: '' });

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const { data } = await api.get('/admin/agents');
        setAgents(Array.isArray(data) ? data : []);
      } catch (error) {
        setStatus({ loading: false, error: 'We could not load our advisors right now.' });
        return;
      }
      setStatus({ loading: false, error: '' });
    };
    fetchAgents();
  }, []);

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
        {status.loading ? (
          <div className="py-16 text-center text-charcoal-muted font-serif italic">Loading our advisors...</div>
        ) : status.error ? (
          <div className="py-16 text-center text-charcoal-muted border border-stone">{status.error}</div>
        ) : agents.length === 0 ? (
          <div className="py-16 text-center text-charcoal-muted border border-stone">Our advisor profiles are being prepared.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {agents.map((agent) => <AgentCard key={agent._id || agent.email || agent.name} agent={agent} />)}
          </div>
        )}

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