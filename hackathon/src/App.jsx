import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './pages/Landing';
import Discover from './pages/Discover';
import LabDetail from './pages/LabDetail';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import { getStoredProfile } from './data/student';

const SignupRoute = () => {
  const location = useLocation();
  const isSignedIn = !!getStoredProfile();

  if (isSignedIn && !location.state?.fromProfile) {
    return <Navigate to="/profile" replace />;
  }

  return <Signup />;
};

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
          <Route path="/signup" element={<SignupRoute />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
