import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './pages/Landing';
import Discover from './pages/Discover';
import LabDetail from './pages/LabDetail';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/lab/:id" element={<LabDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
