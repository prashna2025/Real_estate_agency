import React from 'react';
import { Outlet, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Home, Mail, LogOut } from 'lucide-react';
import { cn } from '../../utils/cn';

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Properties', path: '/admin/properties', icon: Home },
    { name: 'Inquiries', path: '/admin/inquiries', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className="w-64 bg-charcoal text-cream flex flex-col hidden md:flex fixed h-full z-10">
        <div className="h-20 flex items-center px-6 border-b border-charcoal-light">
          <span className="font-serif text-xl font-semibold tracking-tight">
            Boutique<span className="font-light italic text-terracotta">Estate</span> <span className="text-xs ml-1 text-cream-dark/50">Admin</span>
          </span>
        </div>
        
        <nav className="flex-1 py-8 px-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-sm transition-colors font-medium text-sm",
                isActive ? "bg-terracotta text-white" : "text-cream hover:bg-charcoal-light hover:text-white"
              )}
            >
              <item.icon size={18} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-charcoal-light">
          <div className="px-4 py-2 mb-4 text-xs text-cream-dark/50">
            Logged in as <br/>
            <span className="text-cream text-sm">{admin.name}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-cream hover:bg-charcoal-light rounded-sm transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content (Offset by sidebar width) */}
      <main className="flex-1 md:ml-64 p-8 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
