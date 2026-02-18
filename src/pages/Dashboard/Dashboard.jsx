import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, BarChart2, Users, Settings, Truck, Calendar, LogOut, Menu, X } from 'lucide-react';
import Overview from './Overview';
import Analytics from './Analytics';
import UsersPage from './Users';
import Vehicles from './Vehicles';
import Reservations from './Reservations';
import SettingsPage from './Settings';
import './Dashboard.css';

const navItems = [
  { id: 'overview', label: 'Overview', icon: <Home size={16}/> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={16}/> },
  { id: 'users', label: 'Users', icon: <Users size={16}/> },
  { id: 'vehicles', label: 'Vehicles', icon: <Truck size={16}/> },
  { id: 'reservations', label: 'Reservations', icon: <Calendar size={16}/> },
  { id: 'settings', label: 'Settings', icon: <Settings size={16}/> },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin', role: 'admin' };

  // Check if user is admin
  React.useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const renderContent = () => {
    switch(active) {
      case 'analytics': return <Analytics />;
      case 'users': return <UsersPage />;
      case 'vehicles': return <Vehicles />;
      case 'reservations': return <Reservations />;
      case 'settings': return <SettingsPage />;
      default: return <Overview onTabChange={setActive} />;
    }
  }

  return (
    <div className="dashboard">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="brand">
          <div className="logo">CR</div>
          <h2>CarRental</h2>
        </div>
        <nav className="side-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${active === item.id ? 'active' : ''}`}
              onClick={() => setActive(item.id)}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </button>
          ))}
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={16} /> Logout
        </button>
      </aside>
      <main className="main">
        <header className="main-header">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="page-title">{navItems.find(n=>n.id===active)?.label}</h1>
          <div className="profile">
          <div className="avatar">{user.name.split(' ').map(n => n[0]).join('')}</div>
          <div className="meta">
            <div className="name">{user.name}</div>
            <div className="role">{user.role}</div>
          </div>
        </div>
        </header>
        <section className="content">
          {renderContent()}
        </section>
      </main>
    </div>
  );
}
