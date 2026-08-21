import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/public/PublicLayout';
import AdminLayout from './components/admin/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import Properties from './pages/public/Properties';
import PropertyDetail from './pages/public/PropertyDetails';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageProperties from './pages/admin/ManageProperties';

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
          <Route path="agents" element={<InfoPage title="Meet our agents">Our advisors combine local market knowledge with thoughtful, transparent guidance.</InfoPage>} />
          <Route path="contact" element={<InfoPage title="Contact us">Reach our Kathmandu office at hello@boutiqueestate.com or +977 1-4000000.</InfoPage>} />
          <Route path="privacy" element={<InfoPage title="Privacy policy">We use inquiry information only to respond to property requests and provide requested services.</InfoPage>} />
          <Route path="terms" element={<InfoPage title="Terms of service">Property information is provided for guidance and remains subject to verification and availability.</InfoPage>} />
        </Route>
        
        {/* Admin Auth Route */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="properties" element={<ManageProperties />} />
          <Route path="inquiries" element={<div className="p-8 font-serif text-xl">Inquiry management is available through the API.</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;