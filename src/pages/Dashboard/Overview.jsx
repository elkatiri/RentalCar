import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '../../config/api';
import './Dashboard.css';
const token = localStorage.getItem('token');

export default function Overview({ onTabChange }) {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        axios.get(`${API}/dashboard/overview`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/dashboard/recent-activity`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setStats(statsRes.data);
      setActivity(activityRes.data);
    } catch (error) {
      console.error('Error fetching overview:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="overview">
      <div className="cards">
        <div className="card">
          <div className="card-title">Revenue</div>
          <div className="card-value">${(stats?.revenue || 0).toFixed(0)}</div>
          <div className="card-sub">From approved bookings</div>
        </div>
        <div className="card">
          <div className="card-title">Bookings</div>
          <div className="card-value">{stats?.bookings || 0}</div>
          <div className="card-sub">{stats?.pending_reservations || 0} pending</div>
        </div>
        <div className="card">
          <div className="card-title">Vehicles</div>
          <div className="card-value">{stats?.vehicles || 0}</div>
          <div className="card-sub">In fleet</div>
        </div>
        <div className="card">
          <div className="card-title">Users</div>
          <div className="card-value">{stats?.users || 0}</div>
          <div className="card-sub">Active users</div>
        </div>
      </div>

      <div className="panels">
        <div className="panel card">
          <h3>Recent Activity</h3>
          <ul className="activity-list">
            {activity.map(a => (
              <li key={a.id}>
                <strong>{a.user?.name}</strong> booked <em>{a.vehicle?.brand} {a.vehicle?.model}</em>
                <br/><small>{new Date(a.created_at).toLocaleDateString()}</small>
              </li>
            ))}
            {activity.length === 0 && <li className="empty">No activity yet</li>}
          </ul>
        </div>
        <div className="panel card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <button className="action" onClick={() => onTabChange('vehicles')}>Add Vehicle</button>
            <button className="action" onClick={() => onTabChange('users')}>Manage Users</button>
            <button className="action" onClick={() => onTabChange('reservations')}>View Bookings</button>
          </div>
        </div>
      </div>
    </div>
  );
}
