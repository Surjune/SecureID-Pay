import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@components/Navbar';
import Sidebar from '@components/Sidebar';
import BottomNav from '@components/BottomNav';
import Dashboard from '@pages/Dashboard';
import Payments from '@pages/Payments';
import Lending from '@pages/Lending';
import Insights from '@pages/Insights';
import FraudDashboard from '@pages/FraudDashboard';
import Profile from '@pages/Profile';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="main-content">
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/lending" element={<Lending />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/fraud" element={<FraudDashboard />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </div>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
