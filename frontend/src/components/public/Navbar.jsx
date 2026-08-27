import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, GitCompareArrows, Heart, UserRound } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useCompare } from '../../context/CompareContent';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { compareItems } = useCompare();
  const { favoriteItems } = useFavorites();
  const { user, userLogout } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'Agents', path: '/agents' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-cream border-b border-stone">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="font-serif text-2xl font-semibold tracking-tight text-charcoal flex items-center gap-2">
          <span className="w-4 h-4 bg-terracotta block rounded-sm"></span>
          Boutique<span className="font-light italic text-terracotta">Estate</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => cn(
                "text-sm font-medium transition-colors hover:text-terracotta",
                isActive ? "text-terracotta" : "text-charcoal-muted"
              )}
            >
              {link.name}
            </NavLink>
          ))}
          <NavLink to="/compare" className={({ isActive }) => cn(
            "flex items-center gap-2 text-sm font-medium transition-colors hover:text-terracotta",
            isActive ? "text-terracotta" : "text-charcoal-muted"
          )}>
            <GitCompareArrows size={16} />
            Compare
            {compareItems.length > 0 && <span className="bg-terracotta text-white rounded-full min-w-5 h-5 px-1 flex items-center justify-center text-xs">{compareItems.length}</span>}
          </NavLink>
          <NavLink to="/favorites" className={({ isActive }) => cn(
            "flex items-center gap-2 text-sm font-medium transition-colors hover:text-terracotta",
            isActive ? "text-terracotta" : "text-charcoal-muted"
          )}>
            <Heart size={16} fill={favoriteItems.length > 0 ? 'currentColor' : 'none'} />
            Saved
            {favoriteItems.length > 0 && <span className="bg-terracotta text-white rounded-full min-w-5 h-5 px-1 flex items-center justify-center text-xs">{favoriteItems.length}</span>}
          </NavLink>
          {user ? (
            <button type="button" onClick={userLogout} className="flex items-center gap-2 text-sm font-medium text-charcoal-muted hover:text-terracotta transition-colors">
              <UserRound size={16} />
              Sign out
            </button>
          ) : (
            <NavLink to="/login" className={({ isActive }) => cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-terracotta",
              isActive ? "text-terracotta" : "text-charcoal-muted"
            )}>
              <UserRound size={16} />
              Sign in
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-charcoal"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-cream border-b border-stone px-6 py-4 space-y-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => cn(
                "block text-lg font-serif",
                isActive ? "text-terracotta" : "text-charcoal"
              )}
            >
              {link.name}
            </NavLink>
          ))}
          <NavLink to="/compare" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-lg font-serif text-charcoal">
            <GitCompareArrows size={18} /> Compare {compareItems.length > 0 && `(${compareItems.length})`}
          </NavLink>
          <NavLink to="/favorites" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-lg font-serif text-charcoal">
            <Heart size={18} fill={favoriteItems.length > 0 ? 'currentColor' : 'none'} /> Saved {favoriteItems.length > 0 && `(${favoriteItems.length})`}
          </NavLink>
          {user ? (
            <button type="button" onClick={() => { userLogout(); setIsOpen(false); }} className="flex items-center gap-2 text-lg font-serif text-charcoal">
              <UserRound size={18} /> Sign out
            </button>
          ) : (
            <NavLink to="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-lg font-serif text-charcoal">
              <UserRound size={18} /> Sign in
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
