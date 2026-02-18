import React from 'react';
import Swal from 'sweetalert2';
import './Dashboard.css';

export default function SettingsPage() {
  const handleSave = () => {
    Swal.fire('Success!', 'Settings saved successfully!', 'success');
  };

  return (
    <div className="settings">
      <div className="card" style={{maxWidth: '600px'}}>
        <h3>Application Settings</h3>
        <div className="form-group">
          <label>Site Title</label>
          <input defaultValue="CarRental" />
        </div>
        <div className="form-group">
          <label>Default Currency</label>
          <select defaultValue="USD">
            <option>USD</option>
            <option>EUR</option>
            <option>MAD</option>
            <option>GBP</option>
          </select>
        </div>
        <div className="form-group">
          <label>Support Email</label>
          <input type="email" defaultValue="support@carrental.com" />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input type="tel" defaultValue="+1234567890" />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input defaultValue="123 Main St, City, Country" />
        </div>
        <div style={{display: 'flex', gap: '12px', marginTop: '24px'}}>
          <button className="btn primary" onClick={handleSave}>Save Changes</button>
          <button className="btn secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
}
