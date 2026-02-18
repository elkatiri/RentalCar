import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

import { API } from '../../config/api';
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

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="analytics">
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '20px'}}>
        <div className="card" style={{display: 'flex', flexDirection: 'column'}}>
          <h3 style={{margin: '0 0 20px 0', fontSize: '17px', fontWeight: '700', letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <span style={{
              width: '4px',
              height: '20px',
              background: 'linear-gradient(180deg, var(--accent), var(--accent-2))',
              borderRadius: '2px'
            }}></span>
            Revenue Trend (Last 30 Days)
          </h3>
          <div style={{
            flex: 1,
            maxHeight: '350px',
            overflowY: 'auto',
            paddingRight: '8px',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(106,124,255,0.3) rgba(255,255,255,0.05)'
          }}>
            <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
              {revenueData.map((item, i) => (
                <li 
                  key={i} 
                  style={{
                    padding: '14px 12px',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                    borderRadius: '8px',
                    marginBottom: '4px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.paddingLeft = '16px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.paddingLeft = '12px';
                  }}
                >
                  <span style={{fontSize: '14px', color: 'var(--muted)', fontWeight: '500'}}>{item.date}</span>
                  <strong style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    ${(Number(item.amount) || 0).toFixed(2)}
                  </strong>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card">
          <h3 style={{margin: '0 0 24px 0', fontSize: '17px', fontWeight: '700', letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <span style={{
              width: '4px',
              height: '20px',
              background: 'linear-gradient(180deg, var(--accent), var(--accent-2))',
              borderRadius: '2px'
            }}></span>
            Reservation Status
          </h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {statusData.map((item, i) => {
              const colors = {
                confirmed: 'linear-gradient(135deg, #20c997, #2dd4bf)',
                pending: 'linear-gradient(135deg, #ffb020, #ffd580)',
                rejected: 'linear-gradient(135deg, #ff3b30, #ff6b6b)',
                cancelled: 'linear-gradient(135deg, #9aa5b1, #b8bfc9)'
              };
              const maxCount = Math.max(...statusData.map(s => s.count), 1);
              const percentage = (item.count / maxCount) * 100;
              
              return (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.02)',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.04)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
                }}
                >
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                    <span style={{
                      textTransform: 'capitalize',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'var(--text)'
                    }}>
                      {item.status}
                    </span>
                    <strong style={{
                      fontSize: '18px',
                      fontWeight: '800',
                      background: colors[item.status.toLowerCase()] || 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      {item.count}
                    </strong>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${percentage}%`,
                      background: colors[item.status.toLowerCase()] || 'linear-gradient(90deg, #6a7cff, #4dd0e1)',
                      borderRadius: '4px',
                      transition: 'width 0.5s ease',
                      boxShadow: '0 0 10px rgba(106,124,255,0.3)'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{margin: '0 0 20px 0', fontSize: '17px', fontWeight: '700', letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <span style={{
            width: '4px',
            height: '20px',
            background: 'linear-gradient(180deg, var(--accent), var(--accent-2))',
            borderRadius: '2px'
          }}></span>
          Bookings by Vehicle
        </h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px'}}>
          {bookingData.map((item, i) => (
            <div 
              key={i} 
              style={{
                background: 'linear-gradient(135deg, rgba(106,124,255,0.08), rgba(77,208,225,0.04))',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(106,124,255,0.3)';
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(106,124,255,0.15), rgba(77,208,225,0.08))';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(106,124,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(106,124,255,0.08), rgba(77,208,225,0.04))';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: '13px',
                color: 'var(--muted)',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px'
              }}>
                {item.brand} {item.model}
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: '900',
                marginTop: '8px',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-1px'
              }}>
                {item.count}
              </div>
              <div style={{
                fontSize: '12px',
                color: 'var(--muted)',
                marginTop: '6px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                bookings
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 style={{margin: '0 0 20px 0', fontSize: '17px', fontWeight: '700', letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <span style={{
            width: '4px',
            height: '20px',
            background: 'linear-gradient(180deg, var(--accent), var(--accent-2))',
            borderRadius: '2px'
          }}></span>
          Top Performing Vehicles
        </h3>
        <div style={{overflowX: 'auto'}}>
          <table className="table">
            <thead>
              <tr>
                <th style={{paddingLeft: '16px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                    Vehicle
                  </div>
                </th>
                <th>Price/Day</th>
                <th>Bookings</th>
              </tr>
            </thead>
            <tbody>
              {topVehicles.map((item, i) => (
                <tr key={i} style={{
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
                >
                  <td style={{paddingLeft: '16px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: 'white'
                      }}>
                        {i + 1}
                      </div>
                      <span style={{fontWeight: '600', fontSize: '14px'}}>{item.brand} {item.model}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      fontSize: '15px',
                      fontWeight: '700',
                      color: 'var(--text)'
                    }}>
                      ${item.price_per_day}
                    </span>
                  </td>
                  <td>
                    <div style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: 'linear-gradient(135deg, rgba(106,124,255,0.15), rgba(77,208,225,0.08))',
                      border: '1px solid rgba(106,124,255,0.2)'
                    }}>
                      <strong style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>
                        {item.bookings}
                      </strong>
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
