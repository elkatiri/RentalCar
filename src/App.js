import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import CarListing from "./pages/CarListing/CarListing";
import BookingList from "./pages/BookingList/BookingList";
import VehicleDetails from "./pages/VehicleDetails/VehicleDetails";


function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cars" element={<CarListing />} />
        <Route path="/vehicles/:id" element={<VehicleDetails />} />
        <Route path="/bookings" element={<BookingList />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

