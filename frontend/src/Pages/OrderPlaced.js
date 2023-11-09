import React, { useEffect } from 'react';
import { MdCheckCircle } from 'react-icons/md';
import './Style/OrderPlaced.css';
import { Link, useNavigate } from 'react-router-dom';

const OrderPlaced = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if(!token){
            navigate('/login')
        }
    }, [navigate])
    
  return (
    <div className="order-placed-container">
      <div className="order-success">
        <div className="icon">
          <MdCheckCircle color="#fffff" size={60} />
        </div>
        <h2>Order Placed Successfully</h2>
        <p>Thank you for your order. Your order has been successfully placed.</p>
        <Link to="/">Home</Link>
      </div>
    </div>
  );
};

export default OrderPlaced;
