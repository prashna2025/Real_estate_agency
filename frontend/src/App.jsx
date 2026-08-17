import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/public/PublicLayout';

// Public Pages
import Home from './pages/public/Home';
import Properties from './pages/public/Properties';
import PropertyDetail from './pages/public/PropertyDetail';

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
        
        {/* Admin Routes (Coming Day 5) */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;