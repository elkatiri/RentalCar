import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Edit2, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { API } from '../../config/api';
import './Dashboard.css';
const token = localStorage.getItem('token');

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [editModal, setEditModal] = useState(null);
  const [newStatus, setNewStatus] = useState('pending');

  const fetchReservations = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/reservations?status=${filterStatus}&per_page=50`, { headers: { Authorization: `Bearer ${token}` } });
      setReservations(res.data.data || res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Delete Reservation',
        text: 'Are you sure you want to delete this reservation?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, Delete it!',
      });
      if (result.isConfirmed) {
        await axios.delete(`${API}/reservations/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setReservations(reservations.filter(r => r.id !== id));
        Swal.fire('Deleted!', 'Reservation has been deleted.', 'success');
      }
    } catch (error) {
      Swal.fire('Error!', 'Failed to delete reservation.', 'error');
    }
  };

  const handleStatusUpdate = async (id) => {
    try {
      await axios.put(`${API}/reservations/${id}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
      Swal.fire('Success!', 'Reservation updated successfully.', 'success');
      fetchReservations();
      setEditModal(null);
    } catch (error) {
      Swal.fire('Error!', 'Failed to update reservation.', 'error');
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="reservations">
      <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px'}}>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', background: 'transparent', color: 'inherit'}}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div style={{overflowX: 'auto'}}>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Vehicle</th>
                <th>Dates</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.user?.name}</td>
                  <td>{r.vehicle?.brand} {r.vehicle?.model}</td>
                  <td>{new Date(r.start_date).toLocaleDateString()} - {new Date(r.end_date).toLocaleDateString()}</td>
                  <td>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '999px',
                      fontWeight: '600',
                      fontSize: '12px',
                      background: r.status === 'approved' ? '#d1fae5' : r.status === 'pending' ? '#fef3c7' : '#fee2e2',
                      color: r.status === 'approved' ? '#065f46' : r.status === 'pending' ? '#92400e' : '#991b1b'
                    }}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                  </td>
                  <td style={{display: 'flex', gap: '8px'}}>
                    <button 
                      style={{padding: '8px 12px', fontSize: '12px', fontWeight: '600', border: 'none', borderRadius: '6px', background: '#10b981', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', transition: 'all 0.2s'}}
                      onMouseOver={(e) => e.target.style.background = '#059669'}
                      onMouseOut={(e) => e.target.style.background = '#10b981'}
                      onClick={() => { setEditModal(r); setNewStatus(r.status); }}
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button 
                      style={{padding: '8px 12px', fontSize: '12px', fontWeight: '600', border: 'none', borderRadius: '6px', background: '#ef4444', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', transition: 'all 0.2s'}}
                      onMouseOver={(e) => e.target.style.background = '#dc2626'}
                      onMouseOut={(e) => e.target.style.background = '#ef4444'}
                      onClick={() => handleDelete(r.id)}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editModal && (
        <div className="modal" onClick={() => setEditModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Status</h2>
              <button className="close-btn" onClick={() => setEditModal(null)}>×</button>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <button className="btn primary" onClick={() => handleStatusUpdate(editModal.id)}>Update</button>
          </div>
        </div>
      )}
    </div>
  );
}
