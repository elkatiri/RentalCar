import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API, STORAGE_URL } from '../../config/api';
import { Calendar, MapPin, DollarSign, Trash2, Eye } from 'lucide-react';
import Swal from 'sweetalert2';
import './BookingList.css';
import Navbar from '../../components/NavBar/Navbar';
import Footer from '../../components/footer/footer';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsModal, setDetailsModal] = useState(false);

  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, filterStatus]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      let url = `${API}/reservations?per_page=50`;
      if (filterStatus) {
        url += `&status=${filterStatus}`;
      }
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      // Filter bookings for current user
      const userBookings = data.filter(b => b.user_id === user.id);
      setBookings(userBookings);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const result = await Swal.fire({
      title: 'Cancel Booking',
      text: 'Are you sure you want to cancel this booking?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Cancel it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API}/reservations/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire('Cancelled!', 'Booking has been cancelled.', 'success');
        fetchBookings();
      } catch (error) {
        Swal.fire('Error!', 'Failed to cancel booking.', 'error');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return { bg: '#d1fae5', text: '#065f46' };
      case 'pending':
        return { bg: '#fef3c7', text: '#92400e' };
      case 'rejected':
        return { bg: '#fee2e2', text: '#991b1b' };
      default:
        return { bg: '#e5e7eb', text: '#374151' };
    }
  };

  const calculateDays = (startDate, endDate) => {
    return Math.ceil(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
    );
  };

  const calculateTotal = (pricePerDay, startDate, endDate) => {
    const days = calculateDays(startDate, endDate);
    return days * Number(pricePerDay);
  };

  if (loading) {
    return (
      <div className="booking-list-page">
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading bookings...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="booking-list-page">
      <Navbar />

      <div className="bookings-header">
        <div className="bookings-header-content">
          <h1>My Bookings</h1>
          <p>View and manage your car rental reservations</p>
        </div>
      </div>

      <div className="bookings-container">
        <div className="bookings-filter">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <span className="bookings-count">
            {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
          </span>
        </div>

        <div className="bookings-list">
          {bookings.length > 0 ? (
            bookings.map((booking) => {
              const statusColor = getStatusColor(booking.status);
              const days = calculateDays(booking.start_date, booking.end_date);
              const total = calculateTotal(
                booking.vehicle?.price_per_day || 0,
                booking.start_date,
                booking.end_date
              );

              return (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header-card">
                    <div className="booking-vehicle-info">
                      {booking.vehicle?.image && (
                        <img
                          src={
                            booking.vehicle.image.startsWith('http')
                              ? booking.vehicle.image
                              : `${STORAGE_URL}/${booking.vehicle.image}`
                          }
                          alt={`${booking.vehicle?.brand} ${booking.vehicle?.model}`}
                          className="booking-vehicle-image"
                        />
                      )}
                      <div className="booking-vehicle-details">
                        <h3>
                          {booking.vehicle?.brand} {booking.vehicle?.model}
                        </h3>
                        <p className="booking-id">Booking ID: #{booking.id}</p>
                      </div>
                    </div>
                    <div
                      className="booking-status"
                      style={{
                        background: statusColor.bg,
                        color: statusColor.text,
                      }}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </div>
                  </div>

                  <div className="booking-details-grid">
                    <div className="detail-item">
                      <Calendar size={16} />
                      <div>
                        <p className="detail-label">Pickup Date</p>
                        <p className="detail-value">
                          {new Date(booking.start_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="detail-item">
                      <Calendar size={16} />
                      <div>
                        <p className="detail-label">Return Date</p>
                        <p className="detail-value">
                          {new Date(booking.end_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="detail-item">
                      <MapPin size={16} />
                      <div>
                        <p className="detail-label">Days</p>
                        <p className="detail-value">{days} days</p>
                      </div>
                    </div>

                    <div className="detail-item">
                      <DollarSign size={16} />
                      <div>
                        <p className="detail-label">Price/Day</p>
                        <p className="detail-value">
                          ${Number(booking.vehicle?.price_per_day || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="booking-total">
                    <div className="total-row">
                      <span>Subtotal ({days} days):</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="total-row highlight">
                      <span>Total Amount:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="booking-actions">
                    <button
                      className="btn-details"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setDetailsModal(true);
                      }}
                    >
                      <Eye size={16} /> View Details
                    </button>
                    {booking.status === 'pending' && (
                      <button
                        className="btn-cancel"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        <Trash2 size={16} /> Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-bookings">
              <p>No bookings found.</p>
              <a href="/cars" className="btn-explore">
                Explore Cars
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {detailsModal && selectedBooking && (
        <div className="modal-overlay" onClick={() => setDetailsModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Booking Details</h2>
              <button
                className="modal-close"
                onClick={() => setDetailsModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Vehicle Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Brand:</span>
                    <span className="info-value">
                      {selectedBooking.vehicle?.brand}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Model:</span>
                    <span className="info-value">
                      {selectedBooking.vehicle?.model}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Year:</span>
                    <span className="info-value">
                      {selectedBooking.vehicle?.year}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Price/Day:</span>
                    <span className="info-value">
                      ${Number(selectedBooking.vehicle?.price_per_day).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Reservation Dates</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Pickup Date:</span>
                    <span className="info-value">
                      {new Date(selectedBooking.start_date).toLocaleDateString(
                        'en-US',
                        { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
                      )}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Return Date:</span>
                    <span className="info-value">
                      {new Date(selectedBooking.end_date).toLocaleDateString(
                        'en-US',
                        { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
                      )}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Total Days:</span>
                    <span className="info-value">
                      {calculateDays(
                        selectedBooking.start_date,
                        selectedBooking.end_date
                      )}{' '}
                      days
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Status:</span>
                    <span
                      className="info-value"
                      style={{
                        background: getStatusColor(selectedBooking.status).bg,
                        color: getStatusColor(selectedBooking.status).text,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontWeight: '600',
                      }}
                    >
                      {selectedBooking.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Pricing</h3>
                <div className="pricing-breakdown">
                  <div className="pricing-row">
                    <span>Price per day:</span>
                    <span>
                      ${Number(selectedBooking.vehicle?.price_per_day).toFixed(2)}
                    </span>
                  </div>
                  <div className="pricing-row">
                    <span>
                      Number of days (
                      {calculateDays(
                        selectedBooking.start_date,
                        selectedBooking.end_date
                      )}
                      ):
                    </span>
                    <span>
                      ${(
                        Number(selectedBooking.vehicle?.price_per_day) *
                        calculateDays(
                          selectedBooking.start_date,
                          selectedBooking.end_date
                        )
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="pricing-row total">
                    <span>Total:</span>
                    <span>
                      ${calculateTotal(
                        selectedBooking.vehicle?.price_per_day,
                        selectedBooking.start_date,
                        selectedBooking.end_date
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn-close"
                  onClick={() => setDetailsModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BookingList;
