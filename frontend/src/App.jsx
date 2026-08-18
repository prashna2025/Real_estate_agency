import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/public/PublicLayout';
import AdminLayout from './components/admin/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import Properties from './pages/public/Properties';
import PropertyDetail from './pages/public/PropertyDetail';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageProperties from './pages/admin/ManageProperties';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="properties" element={<Properties />} />
          <Route path="property/:slug" element={<PropertyDetail />} />
        </Route>
        
        {/* Admin Auth Route */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="properties" element={<ManageProperties />} />
          {/* Create a simple ManageInquiries page similarly if needed */}
          <Route path="inquiries" element={<div className="p-8 font-serif text-xl">Manage Inquiries (Coming soon)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;