import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-charcoal text-cream pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-charcoal-light pb-16">
        
        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
          <h3 className="font-serif text-2xl mb-6">Boutique<span className="font-light italic text-terracotta">Estate</span></h3>
          <p className="text-cream-dark/70 text-sm max-w-sm leading-relaxed">
            Curating the finest residential and commercial properties in Nepal. We believe in finding you not just a house, but a home tailored to your lifestyle.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-serif text-lg mb-6 text-white">Explore</h4>
          <ul className="space-y-4 text-sm text-cream-dark/70">
            <li><Link to="/properties" className="hover:text-terracotta transition-colors">Our Properties</Link></li>
            <li><Link to="/agents" className="hover:text-terracotta transition-colors">Meet the Agents</Link></li>
            <li><Link to="/contact" className="hover:text-terracotta transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-serif text-lg mb-6 text-white">Get in touch</h4>
          <ul className="space-y-4 text-sm text-cream-dark/70">
            <li>Durbar Marg, Kathmandu</li>
            <li>hello@boutiqueestate.com</li>
            <li>+977 1-4000000</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-10 text-xs text-cream-dark/50 flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} Boutique Estate. All rights reserved.</p>
        <div className="space-x-4 mt-4 md:mt-0">
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;