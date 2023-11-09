import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [products, setProducts] = useState({});
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;


  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(!token){
        navigate('/login')
    }
  },[navigate])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          const decodedToken = jwtDecode(storedToken);
          const response = await axios.get(`${API_URL}/api/orders/history/${decodedToken.id}`);
          setHistoryData(response.data);
          const productIds = [...new Set(response.data.flatMap(order => order.cartItems.map(item => item.productId)))];

          const productDetails = {};
          for (const productId of productIds) {
            const productResponse = await axios.get(`${API_URL}/api/prod/products/${productId}`);
            productDetails[productId] = productResponse.data;
          }
          setProducts(productDetails);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchData();
  }, [API_URL]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className='order-list'>
      <h2>Purchase History</h2>
      {historyData.map((order) => (
        <div className="order-card" key={order._id}>
          {order.cartItems.map((item, index) => (
            <div className="product-details" key={index}>
              <div className="product-image">
                <img src={products[item.productId]?.image} alt="Product" />
              </div>
              <div className="order-details">
                <div className="order-id">
                  Order ID: {order._id}
                </div>
                <div className="order-date">
                  Order Date: {formatDate(order.createdAt)}
                </div>
                <div className="customer-details">
                  <div className="customer-name">
                    Name: {order.userDetails[0]?.name}
                  </div>
                  <div className="customer-email">
                    Email: {order.userDetails[0]?.email}
                  </div>
                  <div className="customer-phone">
                    Phone: {order.userDetails[0]?.phoneNumber}
                  </div>
                  <div className="customer-address">
                    Address: {order.userDetails[0]?.address}
                  </div>
                </div>
                <div className="product-name">
                  Product Name: {products[item.productId]?.productName || 'Product Not Found'}
                </div>
                <div className="product-price">
                  Price: ₹{products[item.productId]?.price || 'N/A'}
                </div>
                <div className="product-quantity">
                  Quantity: {item.quantity || 0}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default History;
