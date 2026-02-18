import React from 'react'
import { useNavigate } from 'react-router-dom'
import { STORAGE_URL } from '../../config/api'
import { Users, Gauge, Settings, MapPin, Wind, Armchair, Radio, Navigation, Sun, Car, Timer, Flame, Camera } from 'lucide-react'
import './cars.css'

export default function Cars({ vehicles, onBookClick, loading, limit, onCarClick }) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div style={{textAlign: 'center', padding: '40px', color: '#999'}}>
        Loading cars...
      </div>
    )
  }

  // Ensure vehicles is an array
  const vehiclesArray = Array.isArray(vehicles) ? vehicles : (vehicles?.data && Array.isArray(vehicles.data) ? vehicles.data : [])
  const displayedVehicles = limit ? vehiclesArray.slice(0, limit) : vehiclesArray

  const getFeatureIcon = (featureName) => {
    switch (featureName) {
      case '4 Seats':
        return <Users size={18} />
      case 'Hybrid':
        return <Gauge size={18} />
      case 'Automatic':
      case 'Manual':
        return <Settings size={18} />
      case 'Air Conditioning':
        return <Wind size={18} />
      case 'Leather Seats':
        return <Armchair size={18} />
      case 'Bluetooth':
        return <Radio size={18} />
      case 'GPS Navigation':
        return <Navigation size={18} />
      case 'Sunroof':
        return <Sun size={18} />
      case 'All-Wheel Drive':
        return <Car size={18} />
      case 'Cruise Control':
        return <Timer size={18} />
      case 'Heated Seats':
        return <Flame size={18} />
      case 'Rear Camera':
        return <Camera size={18} />
      default:
        return <MapPin size={18} />
    }
  }

  return (
    <div className="cars-container">
      {Array.isArray(displayedVehicles) && displayedVehicles.length > 0 ? (
        displayedVehicles.map((car) => (
          <div key={car.id} className="car-card" onClick={() => {
            if (onCarClick) {
              onCarClick(car.id)
            } else if (navigate) {
              navigate(`/vehicles/${car.id}`)
            }
          }}>
            <div className="car-image">
              <img
                src={
                  car.image && car.image.startsWith('http')
                    ? car.image
                    : car.image ? `${STORAGE_URL}/${car.image}` : 'https://via.placeholder.com/300x200'
                }
                alt={`${car.brand} ${car.model}`}
              />
              {car.available ? (
                <div className="car-status available">Available</div>
              ) : (
                <div className="car-status unavailable">Unavailable</div>
              )}
              <div className="car-price">
                <strong>${Number(car.price_per_day).toFixed(2)}</strong> / day
              </div>
            </div>

            <div className="car-details">
              <h3 className="car-title">
                {car.brand} {car.model}
              </h3>
              {car.year && <p className="car-year">Year: {car.year}</p>}
              <p className="car-subtitle">{car.description}</p>

              <div className="car-info">
                {car.features && car.features.length > 0 ? (
                  car.features.map((feature) => (
                    <div key={feature.id}>
                      {getFeatureIcon(feature.name)} {feature.name}
                    </div>
                  ))
                ) : (
                  <div>No features available</div>
                )}
              </div>

              <button
                className={`book-button ${car.available ? 'active' : 'disabled'}`}
                onClick={() => {
                  if (onBookClick) {
                    onBookClick(car)
                  } else {
                    navigate(`/vehicles/${car.id}`)
                  }
                }}
                disabled={!car.available}
              >
                {car.available ? 'Book Now' : 'Not Available'}
              </button>
            </div>
          </div>
        ))
      ) : (
        <div style={{textAlign: 'center', padding: '40px', color: '#999'}}>
          No cars available
        </div>
      )}
    </div>
  )
}
