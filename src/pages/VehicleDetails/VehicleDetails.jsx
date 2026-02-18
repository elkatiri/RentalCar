import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API, STORAGE_URL } from '../../config/api';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Gauge, Settings, MapPin, Wind, Armchair, Radio, Navigation, Sun, Car, Timer, Flame, Camera, ChevronLeft, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';
import './VehicleDetails.css';
import Navbar from '../../components/NavBar/Navbar';
import Footer from '../../components/footer/footer';
import { X } from 'lucide-react';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingModal, setBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    start_date: '',
    end_date: '',
    location: '',
  });

  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await axios.get(`${API}/vehicles/${id}`);
        setVehicle(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching vehicle:', error);
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  const getFeatureIcon = (featureName) => {
    switch (featureName) {
      case '4 Seats':
        return <Users size={24} />;
      case 'Hybrid':
        return <Gauge size={24} />;
      case 'Automatic':
      case 'Manual':
        return <Settings size={24} />;
      case 'Air Conditioning':
        return <Wind size={24} />;
      case 'Leather Seats':
        return <Armchair size={24} />;
      case 'Bluetooth':
        return <Radio size={24} />;
      case 'GPS Navigation':
        return <Navigation size={24} />;
      case 'Sunroof':
        return <Sun size={24} />;
      case 'All-Wheel Drive':
        return <Car size={24} />;
      case 'Cruise Control':
        return <Timer size={24} />;
      case 'Heated Seats':
        return <Flame size={24} />;
      case 'Rear Camera':
        return <Camera size={24} />;
      default:
        return <MapPin size={24} />;
    }
  };

  const handleBookingClick = () => {
    if (!token) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please log in to book a vehicle.',
        icon: 'info',
        confirmButtonText: 'Go to Login',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }
    setBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!bookingData.start_date || !bookingData.end_date || !bookingData.location) {
      Swal.fire('Error!', 'Please fill all fields.', 'error');
      return;
    }

    if (new Date(bookingData.start_date) >= new Date(bookingData.end_date)) {
      Swal.fire('Error!', 'Return date must be after pickup date.', 'error');
      return;
    }

    try {
      const response = await axios.post(
        `${API}/reservations`,
        {
          vehicle_id: vehicle.id,
          user_id: user.id,
          start_date: bookingData.start_date,
          end_date: bookingData.end_date,
          status: 'pending',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire('Success!', 'Booking created successfully. Please wait for admin approval.', 'success');
      setBookingModal(false);
      setBookingData({ start_date: '', end_date: '', location: '' });
      navigate('/bookings');
    } catch (error) {
      Swal.fire('Error!', error.response?.data?.message || 'Failed to create booking.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="vehicle-details">
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading vehicle details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="vehicle-details">
        <Navbar />
        <div className="error-container">
          <p>Vehicle not found</p>
          <button onClick={() => navigate('/cars')}>Back to Cars</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="vehicle-details">
      <Navbar />

      <div className="details-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} /> Back
        </button>
      </div>

      <div className="details-container">
        <div className="details-content">
          {/* Main Image */}
          <div className="details-image-section">
            <img
              src={
                vehicle.image && vehicle.image.startsWith('http')
                  ? vehicle.image
                  : vehicle.image
                  ? `${STORAGE_URL}/${vehicle.image}`
                  : 'https://via.placeholder.com/600x400'
              }
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="details-main-image"
            />
            <div className={`status-badge ${vehicle.available ? 'available' : 'unavailable'}`}>
              {vehicle.available ? '✓ Available' : '✗ Not Available'}
            </div>
          </div>

          {/* Details Info */}
          <div className="details-info">
            <div className="details-header-section">
              <div>
                <h1 className="details-title">
                  {vehicle.brand} {vehicle.model}
                </h1>
                <p className="details-year">Year: {vehicle.year}</p>
              </div>
              <div className="price-section">
                <p className="price-label">Price per day</p>
                <p className="price-amount">${Number(vehicle.price_per_day).toFixed(2)}</p>
              </div>
            </div>

            <p className="details-description">{vehicle.description}</p>

            {/* Features */}
            <div className="features-section">
              <h2>Features & Specifications</h2>
              <div className="features-grid">
                {vehicle.features && vehicle.features.length > 0 ? (
                  vehicle.features.map((feature) => (
                    <div key={feature.id} className="feature-item">
                      {getFeatureIcon(feature.name)}
                      <span>{feature.name}</span>
                    </div>
                  ))
                ) : (
                  <p>No features available</p>
                )}
              </div>
            </div>

            {/* Booking Button */}
            <button
              className={`book-button-large ${vehicle.available ? 'active' : 'disabled'}`}
              onClick={handleBookingClick}
              disabled={!vehicle.available}
            >
              {vehicle.available ? 'Book Now' : 'Not Available'}
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModal && (
        <div className="modal-overlay" onClick={() => setBookingModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book {vehicle.brand} {vehicle.model}</h2>
              <button className="modal-close" onClick={() => setBookingModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="booking-car-preview">
                <img
                  src={
                    vehicle.image && vehicle.image.startsWith('http')
                      ? vehicle.image
                      : vehicle.image
                      ? `${STORAGE_URL}/${vehicle.image}`
                      : 'https://via.placeholder.com/300x200'
                  }
                  alt={`${vehicle.brand} ${vehicle.model}`}
                />
                <div className="booking-car-details">
                  <h3>{vehicle.brand} {vehicle.model}</h3>
                  <p>${Number(vehicle.price_per_day).toFixed(2)}/day</p>
                </div>
              </div>

              <form onSubmit={handleBookingSubmit} className="booking-form">
                <div className="form-group">
                  <label htmlFor="location">
                    <MapPin size={16} /> Pickup Location
                  </label>
                  <select
                    id="location"
                    value={bookingData.location}
                    onChange={(e) => setBookingData({ ...bookingData, location: e.target.value })}
                    required
                  >
                    <option value="">Select location</option>
                    <option value="casablanca">Casablanca</option>
                    <option value="marrakech">Marrakech</option>
                    <option value="agadir">Agadir</option>
                    <option value="fez">Fez</option>
                    <option value="tangier">Tangier</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="start_date">
                    <Calendar size={16} /> Pickup Date
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    value={bookingData.start_date}
                    onChange={(e) => setBookingData({ ...bookingData, start_date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="end_date">
                    <Calendar size={16} /> Return Date
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    value={bookingData.end_date}
                    onChange={(e) => setBookingData({ ...bookingData, end_date: e.target.value })}
                    min={bookingData.start_date || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                {bookingData.start_date && bookingData.end_date && (
                  <div className="booking-summary">
                    <h4>Booking Summary</h4>
                    <div className="summary-item">
                      <span>Days:</span>
                      <span>{Math.ceil((new Date(bookingData.end_date) - new Date(bookingData.start_date)) / (1000 * 60 * 60 * 24))}</span>
                    </div>
                    <div className="summary-item">
                      <span>Price per day:</span>
                      <span>${Number(vehicle.price_per_day).toFixed(2)}</span>
                    </div>
                    <div className="summary-item total">
                      <span>Total:</span>
                      <span>
                        ${(
                          Number(vehicle.price_per_day) *
                          Math.ceil((new Date(bookingData.end_date) - new Date(bookingData.start_date)) / (1000 * 60 * 60 * 24))
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={() => setBookingModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-confirm">
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default VehicleDetails;
