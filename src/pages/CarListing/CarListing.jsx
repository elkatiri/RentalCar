import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API, STORAGE_URL } from '../../config/api';
import { Calendar, MapPin, X } from 'lucide-react';
import Swal from 'sweetalert2';
import './CarListing.css';
import Navbar from '../../components/NavBar/Navbar';
import Footer from '../../components/footer/footer';
import Cars from '../../components/cars/cars';

const CarListing = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [bookingData, setBookingData] = useState({
    start_date: '',
    end_date: '',
    location: '', 
  });
  const [bookingModal, setBookingModal] = useState(false);

  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`${API}/vehicles?per_page=100`);
      const carsData = Array.isArray(response.data) ? response.data : (response.data.data || []);
      setVehicles(carsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setLoading(false);
    }
  };

  const handleBookingClick = (car) => {
    if (!token) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please log in to book a vehicle.',
        icon: 'info',
        confirmButtonText: 'Go to Login',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/login';
        }
      });
      return;
    }
    setSelectedCar(car);
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
          vehicle_id: selectedCar.id,
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
      setSelectedCar(null);
    } catch (error) {
      Swal.fire('Error!', error.response?.data?.message || 'Failed to create booking.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="car-listing">
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading vehicles...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="car-listing">
      <Navbar />

      <div className="listing-header">
        <div className="listing-header-overlay"></div>
        <div className="listing-header-content">
          <div className="header-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
            <span>Premium Fleet</span>
          </div>
          <h1>
            Discover Your Perfect Ride
            <span className="header-gradient-text">Luxury Meets Performance</span>
          </h1>
          <p>Handpicked premium vehicles designed for unforgettable journeys. From sleek sedans to powerful SUVs.</p>
          
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Premium Cars</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Available</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">4.9★</span>
              <span className="stat-label">Rating</span>
            </div>
          </div>
        </div>
      </div>

      <div className="listing-container">
        <Cars 
          vehicles={vehicles}
          loading={loading}
          onBookClick={handleBookingClick}
        />
      </div>

      {/* Booking Modal */}
      {bookingModal && selectedCar && (
        <div className="modal-overlay" onClick={() => setBookingModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book {selectedCar.brand} {selectedCar.model}</h2>
              <button className="modal-close" onClick={() => setBookingModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="booking-car-preview">
                <img
                  src={
                    selectedCar.image && selectedCar.image.startsWith('http')
                      ? selectedCar.image
                      : selectedCar.image
                      ? `${STORAGE_URL}/${selectedCar.image}`
                      : 'https://via.placeholder.com/300x200'
                  }
                  alt={`${selectedCar.brand} ${selectedCar.model}`}
                />
                <div className="booking-car-details">
                  <h3>{selectedCar.brand} {selectedCar.model}</h3>
                  <p>${Number(selectedCar.price_per_day).toFixed(2)}/day</p>
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
                      <span>${Number(selectedCar.price_per_day).toFixed(2)}</span>
                    </div>
                    <div className="summary-item total">
                      <span>Total:</span>
                      <span>
                        ${(
                          Number(selectedCar.price_per_day) *
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

export default CarListing;
