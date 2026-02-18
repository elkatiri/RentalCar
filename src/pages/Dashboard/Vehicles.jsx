import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Edit2, Trash2, Plus, Upload } from 'lucide-react';
import Swal from 'sweetalert2';
import { API } from '../../config/api';
import './Dashboard.css';
const token = localStorage.getItem('token');

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState({ brand: '', model: '', year: new Date().getFullYear(), price_per_day: '', image: null, available: true });
  const [imagePreview, setImagePreview] = useState(null);

  const fetchVehicles = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/vehicles?search=${search}&per_page=50`, { headers: { Authorization: `Bearer ${token}` } });
      setVehicles(res.data.data || res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Delete Vehicle',
        text: 'Are you sure you want to delete this vehicle?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, Delete it!',
      });

      if (result.isConfirmed) {
        await axios.delete(`${API}/vehicles/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setVehicles(vehicles.filter(v => v.id !== id));
        Swal.fire('Deleted!', 'Vehicle has been deleted.', 'success');
      }
    } catch (error) {
      Swal.fire('Error!', 'Failed to delete vehicle.', 'error');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      submitData.append('brand', formData.brand);
      submitData.append('model', formData.model);
      submitData.append('year', formData.year);
      submitData.append('price_per_day', formData.price_per_day);
      submitData.append('available', formData.available);
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      if (modal?.id) {
        await axios.post(`${API}/vehicles/${modal.id}?_method=PUT`, submitData, { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        });
        Swal.fire('Success!', 'Vehicle updated successfully.', 'success');
      } else {
        await axios.post(`${API}/vehicles`, submitData, { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        });
        Swal.fire('Success!', 'Vehicle created successfully.', 'success');
      }
      fetchVehicles();
      setModal(null);
      setImagePreview(null);
      setFormData({ brand: '', model: '', year: new Date().getFullYear(), price_per_day: '', image: null, available: true });
    } catch (error) {
      Swal.fire('Error!', 'Failed to save vehicle.', 'error');
      console.error(error);
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="vehicles">
      <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
          <input 
            type="text" 
            placeholder="Search vehicles..." 
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              fetchVehicles();
            }}
            className="search-input"
            style={{padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', color: 'inherit', flex: 1, marginRight: '12px', fontSize: '14px', transition: 'all .2s ease'}}
          />
          <button className="btn primary" onClick={() => setModal({})}>
            <Plus size={16} /> Add Vehicle
          </button>
        </div>
        <div style={{overflowX: 'auto'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
            {vehicles.map(v => (
              <div 
                key={v.id} 
                className="vehicle-card"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)';
                }}
              >
                <div style={{position: 'relative', overflow: 'hidden'}}>
                  {v.image ? (
                    <img 
                      src={v.image}
                      alt={`${v.brand} ${v.model}`}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        backgroundColor: 'rgba(255,255,255,0.02)',
                        transition: 'transform 0.3s ease'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200/1f2937/9ca3af?text=' + encodeURIComponent(v.brand + ' ' + v.model);
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '200px',
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--muted)',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      No Image
                    </div>
                  )}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    background: v.available ? 'linear-gradient(135deg, #20c997, #2dd4bf)' : 'linear-gradient(135deg, #ff3b30, #ff6b6b)',
                    color: v.available ? '#042022' : '#fff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    {v.available ? '✓ Available' : '✗ Unavailable'}
                  </div>
                </div>
                
                <div style={{padding: '20px', flex: 1, display: 'flex', flexDirection: 'column'}}>
                  <h4 style={{
                    margin: '0 0 12px 0',
                    color: 'var(--text)',
                    fontSize: '18px',
                    fontWeight: '700',
                    letterSpacing: '-0.3px',
                    background: 'linear-gradient(135deg, var(--text) 0%, rgba(230,238,248,0.7) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {v.brand} {v.model}
                  </h4>
                  
                  <div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <span style={{
                        fontSize: '13px',
                        color: 'var(--muted)',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        minWidth: '50px'
                      }}>Year:</span>
                      <span style={{fontSize: '14px', color: 'var(--text)', fontWeight: '600'}}>{v.year}</span>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <span style={{
                        fontSize: '13px',
                        color: 'var(--muted)',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        minWidth: '50px'
                      }}>Price:</span>
                      <span style={{
                        fontSize: '18px',
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>
                        ${Number(v.price_per_day).toFixed(2)}/day
                      </span>
                    </div>
                  </div>
                  
                  <div style={{marginTop: 'auto', display: 'flex', gap: '10px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.04)'}}>
                    <button 
                      className="vehicle-btn edit-btn"
                      style={{
                        flex: 1,
                        padding: '10px 16px',
                        fontSize: '13px',
                        fontWeight: '700',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, rgba(106,124,255,0.1), rgba(77,208,225,0.05))',
                        color: 'var(--text)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, rgba(106,124,255,0.2), rgba(77,208,225,0.1))';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.borderColor = 'rgba(106,124,255,0.3)';
                        e.target.style.boxShadow = '0 4px 16px rgba(106,124,255,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, rgba(106,124,255,0.1), rgba(77,208,225,0.05))';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                        e.target.style.boxShadow = 'none';
                      }}
                      onClick={() => { setModal(v); setFormData(v); setImagePreview(v.image); }}
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button 
                      className="vehicle-btn delete-btn"
                      style={{
                        flex: 1,
                        padding: '10px 16px',
                        fontSize: '13px',
                        fontWeight: '700',
                        border: '1px solid rgba(255,59,48,0.25)',
                        borderRadius: '8px',
                        background: 'rgba(255,59,48,0.08)',
                        color: '#ff6b6b',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255,59,48,0.15)';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.borderColor = 'rgba(255,59,48,0.4)';
                        e.target.style.boxShadow = '0 4px 12px rgba(255,59,48,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255,59,48,0.08)';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.borderColor = 'rgba(255,59,48,0.25)';
                        e.target.style.boxShadow = 'none';
                      }}
                      onClick={() => handleDelete(v.id)}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modal && (
        <div className="modal" onClick={() => setModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal.id ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
              <button className="close-btn" onClick={() => setModal(null)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Brand</label>
                <input value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Model</label>
                <input value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Year</label>
                <input type="number" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Price/Day</label>
                <input type="number" step="0.01" value={formData.price_per_day} onChange={(e) => setFormData({...formData, price_per_day: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Vehicle Image</label>
                <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '2px dashed rgba(106,124,255,0.3)',
                    background: 'rgba(106,124,255,0.08)',
                    cursor: 'pointer',
                    flex: 1,
                    transition: 'all 0.2s ease',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(106,124,255,0.12)';
                    e.currentTarget.style.borderColor = 'rgba(106,124,255,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(106,124,255,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(106,124,255,0.3)';
                  }}
                  >
                    <Upload size={18} style={{color: 'var(--accent)'}} />
                    <span style={{color: 'var(--text)'}}>Choose Image</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{display: 'none'}} />
                  </label>
                </div>
                {imagePreview && (
                  <div style={{marginTop: '16px', textAlign: 'center', position: 'relative'}}>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{
                        maxWidth: '100%',
                        maxHeight: '220px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.06)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                      }} 
                    />
                  </div>
                )}
              </div>
              <button type="submit" className="btn primary" style={{width: '100%', marginTop: '8px'}}>
                {modal.id ? 'Update Vehicle' : 'Add Vehicle'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
