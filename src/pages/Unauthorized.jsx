import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/unauthorized.css';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="unauthorized-container">
        <h1>🚫 Unauthorized Access</h1>
        <p>You do not have permission to view this page.</p>
        <button onClick={() => navigate('/account')}>Go to My Account</button>
      </div>
    </>
  );
};

export default Unauthorized;
