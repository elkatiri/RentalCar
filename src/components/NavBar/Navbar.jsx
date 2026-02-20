```
import './navbar.css';
import { Search, Menu, X, LogOut, ChevronDown, User } from 'lucide-react';
import { API, STORAGE_URL } from '../../config/api';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';


export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allVehicles, setAllVehicles] = useState([]);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      const userData = localStorage.getItem('user');
      setUser(userData ? JSON.parse(userData) : null);
    }
  }, [token]);

  // Fetch all vehicles for search
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(`${ API }/vehicles?per_page=100`);
const vehiclesData = Array.isArray(response.data) ? response.data : (response.data.data || []);
setAllVehicles(vehiclesData);
      } catch (error) {
  console.error('Error fetching vehicles:', error);
}
    };
fetchVehicles();
  }, []);

// Handle search
useEffect(() => {
  if (searchQuery.trim() === '') {
    setSearchResults([]);
    setShowSearchResults(false);
    return;
  }

  const query = searchQuery.toLowerCase();
  const filtered = allVehicles.filter((vehicle) => {
    const brand = vehicle.brand?.toLowerCase() || '';
    const model = vehicle.model?.toLowerCase() || '';
    return brand.includes(query) || model.includes(query);
  });

  setSearchResults(filtered);
  setShowSearchResults(true);
}, [searchQuery, allVehicles]);

// Close dropdown when clicking outside
useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowSearchResults(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setUser(null);
  setShowDropdown(false);
  navigate('/');
};

// Hide navbar on auth pages
if (location.pathname === '/login' || location.pathname === '/signup') {
  return null;
}

return (
  <div className="navbar">
    {/* <div className="logo">
        <img src={logo} alt="Logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}} />
      </div> */}
    <div className="logo" onClick={() => navigate('/')}>
      <span className="logo-text">RentelCar</span>
    </div>
    <div className='menu-icon' onClick={() => setOpen(!isOpen)}>
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </div>
    <ul className={`nav-links ${isOpen ? 'nav-active' : ''}`}>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/cars">Cars</Link></li>
      {user && <li><Link to="/bookings">My Bookings</Link></li>}
      {user && user.role === 'admin' && <li><Link to="/dashboard">Dashboard</Link></li>}
      <div className="search-box" ref={searchRef}>
        <input
          type="text"
          placeholder="Search vehicles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery && setShowSearchResults(true)}
        />
        <Search className='search-icon' size={14} />

        {/* Search Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div className="search-results-dropdown">
            {searchResults.map((vehicle) => (
              <div
                key={vehicle.id}
                className="search-result-item"
                onClick={() => {
                  navigate(`/vehicles/${vehicle.id}`);
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
              >
                <img
                  src={
                    vehicle.image && vehicle.image.startsWith('http')
                      ? vehicle.image
                      : vehicle.image
                        ? `${STORAGE_URL}/${vehicle.image}`
                        : 'https://via.placeholder.com/50x40'
                  }
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="search-result-image"
                />
                <div className="search-result-info">
                  <div className="search-result-name">
                    {vehicle.brand} {vehicle.model}
                  </div>
                  <div className="search-result-price">
                    ${Number(vehicle.price_per_day).toFixed(2)}/day
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="auth-section">
        {!token ? (
          <ul className="auth-links">
            <li><Link to="/login">Login</Link></li>
          </ul>
        ) : (
          <div className="user-dropdown" ref={dropdownRef}>
            <button
              className="user-toggle"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="user-avatar">
                <User size={16} />
              </div>
              <span className="user-name">{user?.name || 'User'}</span>
              <ChevronDown
                size={16}
                className={`chevron ${showDropdown ? 'rotate' : ''}`}
              />
            </button>

            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <div className="dropdown-user-info">
                    <strong>{user?.name}</strong>
                    <span className="user-email">{user?.email}</span>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout-item" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </ul>
  </div>
);
}