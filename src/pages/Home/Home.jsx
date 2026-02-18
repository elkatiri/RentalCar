import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '../../config/api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/NavBar/Navbar';
import './Home.css';
import carImage from '../../images/main_car.webp';
import Cars from '../../components/cars/cars';
import { MoveRight } from 'lucide-react';
import imgAction from '../../images/call-action.png';
import Reviews from '../../components/reviews/reviews';
import Footer from '../../components/footer/footer';

const Home = () => {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(`${API}/vehicles`);
        setCars(response.data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };
    fetchCars();
  }, []);

  return (
    <div className="home">
      <Navbar />
      <div className="section">
        <div className="container">
          <h1 className="title">Luxury cars on Rent</h1>

          <div className="search-container">
            <div className="search-item">
              <label htmlFor="pickup-location">Pickup Location</label>
              <select id="pickup-location">
                <option value="">Please select location</option>
                <option value="casablanca">Casablanca</option>
                <option value="marrakech">Marrakech</option>
                <option value="agadir">Agadir</option>
              </select>
            </div>

            <div className="search-item">
              <label htmlFor="pickup-date">Pick-up Date</label>
              <input type="date" id="pickup-date" />
            </div>

            <div className="search-item">
              <label htmlFor="return-date">Return Date</label>
              <input type="date" id="return-date" />
            </div>

            <div className="search">
              <button className="search-button">Search</button>
            </div>
          </div>

          <div className="image-car">
            <img src={carImage} alt="Luxury car" />
          </div>
        </div>
      </div>
      {/* Featured Cars Section */}
      <div className="featured-cars">
        <h1 className="featured-title">Featured Vehicles</h1>
        <p className="featured-subtitle">
          Explore our selection of premium vehicles available for your next adventure.
        </p>
        {/* Car List Component */}
        <div className="car-list">
          <Cars vehicles={cars} limit={4} />
        </div>
      </div>
       {/* Load More Button */}
      <div className='load-more'>
        <button onClick={() => navigate('/cars')}>Explore all cars <MoveRight className='arrow' /> </button>
      </div>
      <div className='call-action'>
        <div className ='content'>
          <h1>Ready to hit the road?</h1>
          <p>Monetize your vehicle effortlessly by listing it on CarRental.
            We take care of insurance, driver verification and secure payments — so you can earn passive income, stress-free.</p>
          <button className='cta-button'>List your car</button>
        </div>
        <div className='img-cta'>
          <img src={imgAction} alt="call-action" />
        </div>
      </div>
      {/* reviews section */}
      <div className="review-call-toAction">
          <h1 className="review-title">What Our Clients Say</h1>
        <p className="review-subtitle">
          Discover some of our Clients reviews about our services
        </p>
        </div>
      <Reviews />
      <Footer />
    </div>
  );
};

export default Home;
