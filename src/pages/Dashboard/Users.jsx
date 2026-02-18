import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Edit2, Trash2, Plus } from 'lucide-react';
import Swal from 'sweetalert2';
import { API } from '../../config/api';
import './Dashboard.css';
const token = localStorage.getItem('token');

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'user' });

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/users?search=${search}`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(res.data.data || res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Delete User',
        text: 'Are you sure you want to delete this user?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, Delete it!',
      });
      if (result.isConfirmed) {
        await axios.delete(`${API}/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setUsers(users.filter(u => u.id !== id));
        Swal.fire('Deleted!', 'User has been deleted.', 'success');
      }
    } catch (error) {
      Swal.fire('Error!', 'Failed to delete user.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal?.id) {
        await axios.put(`${API}/users/${modal.id}`, formData, { headers: { Authorization: `Bearer ${token}` } });
        Swal.fire('Success!', 'User updated successfully.', 'success');
      } else {
        await axios.post(`${API}/users`, { ...formData, password: 'temppass123' }, { headers: { Authorization: `Bearer ${token}` } });
        Swal.fire('Success!', 'User created successfully.', 'success');
      }
      fetchUsers();
      setModal(null);
      setFormData({ name: '', email: '', role: 'user' });
    } catch (error) {
      Swal.fire('Error!', 'Failed to save user.', 'error');
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="users">
      <div className="card table-card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
          <input 
            type="text" 
            placeholder="Search users..." 
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              fetchUsers();
            }}
            style={{padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', background: 'transparent', color: 'inherit', flex: 1, marginRight: '12px'}}
          />
          <button className="btn primary" onClick={() => setModal({})}>
            <Plus size={16} /> Add User
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className={`badge ${u.role}`}>{u.role}</span></td>
                <td style={{display: 'flex', gap: '8px'}}>
                  <button 
                    style={{padding: '8px 12px', fontSize: '12px', fontWeight: '600', border: 'none', borderRadius: '6px', background: '#10b981', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', transition: 'all 0.2s'}}
                    onMouseOver={(e) => e.target.style.background = '#059669'}
                    onMouseOut={(e) => e.target.style.background = '#10b981'}
                    onClick={() => { setModal(u); setFormData(u); }}
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button 
                    style={{padding: '8px 12px', fontSize: '12px', fontWeight: '600', border: 'none', borderRadius: '6px', background: '#ef4444', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', transition: 'all 0.2s'}}
                    onMouseOver={(e) => e.target.style.background = '#dc2626'}
                    onMouseOut={(e) => e.target.style.background = '#ef4444'}
                    onClick={() => handleDelete(u.id)}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal" onClick={() => setModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal.id ? 'Edit User' : 'Add User'}</h2>
              <button className="close-btn" onClick={() => setModal(null)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                  <option value="user">User</option>
                  <option value="host">Host</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="btn primary">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
