import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/public/PublicLayout';

// Placeholder Pages (To be built on Day 4)
const Home = () => <div className="p-20 text-center font-serif text-3xl">Home Page (Coming Day 4)</div>;
const Properties = () => <div className="p-20 text-center font-serif text-3xl">Properties List</div>;
const PropertyDetail = () => <div className="p-20 text-center font-serif text-3xl">Property Detail</div>;

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
