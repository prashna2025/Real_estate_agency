import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/public/PublicLayout';
import AdminLayout from './components/admin/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import Properties from './pages/public/Properties';
import PropertyDetail from './pages/public/PropertyDetails';
import Compare from './pages/public/Compare';
import Agents from './pages/public/Agents';
import Contact from './pages/public/Contact';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageProperties from './pages/admin/ManageProperties';
import Inquiries from './pages/admin/Inquiries';

const InfoPage = ({ title, children }) => (
  <div className="max-w-4xl mx-auto px-6 py-20">
    <h1 className="font-serif text-4xl mb-6">{title}</h1>
    <p className="text-charcoal-muted leading-relaxed">{children}</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="properties" element={<Properties />} />
          <Route path="property/:slug" element={<PropertyDetail />} />
          <Route path="compare" element={<Compare />} />
          <Route path="agents" element={<Agents />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<InfoPage title="Privacy policy">We use inquiry information only to respond to property requests and provide requested services.</InfoPage>} />
          <Route path="terms" element={<InfoPage title="Terms of service">Property information is provided for guidance and remains subject to verification and availability.</InfoPage>} />
        </Route>
        
        {/* Admin Auth Route */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="properties" element={<ManageProperties />} />
          <Route path="inquiries" element={<Inquiries />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;