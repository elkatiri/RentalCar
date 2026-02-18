import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '../../config/api';
import './Dashboard.css';
const token = localStorage.getItem('token');

export default function Analytics() {
  const [revenueData, setRevenueData] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [topVehicles, setTopVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [revenue, bookings, status, top] = await Promise.all([
        axios.get(`${API}/dashboard/revenue-analytics?days=30`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/dashboard/bookings-by-vehicle`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/dashboard/reservation-status`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/dashboard/top-vehicles`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setRevenueData(revenue.data);
      setBookingData(bookings.data);
      setStatusData(status.data);
      setTopVehicles(top.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'linear-gradient(135deg, #20c997, #2dd4bf)',
      pending: 'linear-gradient(135deg, #ffb020, #ffd580)',
      rejected: 'linear-gradient(135deg, #ff3b30, #ff6b6b)',
      cancelled: 'linear-gradient(135deg, #9aa5b1, #b8bfc9)'
    };
    return colors[status.toLowerCase()] || 'linear-gradient(135deg, var(--accent), var(--accent-2))';
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="analytics">
      {/* Revenue and Status Charts */}
      <div className="analytics-grid">
        {/* Revenue Trend */}
        <div className="card analytics-card">
          <h3 className="analytics-title">
            <span className="analytics-title-bar"></span>
            Revenue Trend (Last 30 Days)
          </h3>
          <ul className="revenue-list">
            {revenueData.map((item, i) => (
              <li key={i} className="revenue-item">
                <span className="revenue-date">{item.date}</span>
                <strong className="revenue-amount">${(Number(item.amount) || 0).toFixed(2)}</strong>
              </li>
            ))}
          </ul>
        </div>

        {/* Reservation Status */}
        <div className="card">
          <h3 className="analytics-title">
            <span className="analytics-title-bar"></span>
            Reservation Status
          </h3>
          <div className="status-container">
            {statusData.map((item, i) => {
              const maxCount = Math.max(...statusData.map(s => s.count), 1);
              const percentage = (item.count / maxCount) * 100;
              
              return (
                <div key={i} className="status-item">
                  <div className="status-header">
                    <span className="status-name">{item.status}</span>
                    <strong className="status-count" style={{ background: getStatusColor(item.status) }}>
                      {item.count}
                    </strong>
                  </div>
                  <div className="status-bar">
                    <div 
                      className="status-bar-fill" 
                      style={{
                        width: `${percentage}%`,
                        background: getStatusColor(item.status)
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bookings by Vehicle */}
      <div className="card">
        <h3 className="analytics-title">
          <span className="analytics-title-bar"></span>
          Bookings by Vehicle
        </h3>
        <div className="bookings-grid">
          {bookingData.map((item, i) => (
            <div key={i} className="booking-card">
              <div className="booking-name">{item.brand} {item.model}</div>
              <div className="booking-count">{item.count}</div>
              <div className="booking-label">bookings</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Vehicles Table */}
      <div className="card">
        <h3 className="analytics-title">
          <span className="analytics-title-bar"></span>
          Top Performing Vehicles
        </h3>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th style={{paddingLeft: '16px'}}>Vehicle</th>
                <th>Price/Day</th>
                <th>Bookings</th>
              </tr>
            </thead>
            <tbody>
              {topVehicles.map((item, i) => (
                <tr key={i}>
                  <td style={{paddingLeft: '16px'}}>
                    <div className="table-vehicle">
                      <div className="table-rank">{i + 1}</div>
                      <span className="table-vehicle-name">{item.brand} {item.model}</span>
                    </div>
                  </td>
                  <td>
                    <span className="table-price">${item.price_per_day}</span>
                  </td>
                  <td>
                    <div className="table-bookings">
                      <strong>{item.bookings}</strong>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
