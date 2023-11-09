import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DisplayOrders.css';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../Context/ToastContext';

const DisplayOrders = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL;
    const { showSuccessToast, showErrorToast } = useToast();

    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/orders/get-orders`);
          setOrders(response.data);
          const productIds = [...new Set(response.data.flatMap(order => order.cartItems.map(item => item.productId)))];
  
          const productDetails = {};
          for (const productId of productIds) {
            const productResponse = await axios.get(`${API_URL}/api/prod/products/${productId}`);
            productDetails[productId] = productResponse.data;
          }
          setProducts(productDetails);
        } catch (error) {
          showErrorToast('Server Busy')
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, [API_URL,showErrorToast]);

    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(token){
            const decodedToken = jwtDecode(token);
            if(!decodedToken.isAdmin){
                navigate('/login')
            }
        }
    },[navigate])
  
    const handleDeliveredClick = async (orderId) => {
        try {
          setLoading(true);
    
          await new Promise(resolve => setTimeout(resolve, 1000));
    
          await axios.delete(`${API_URL}/api/orders/delete-order/${orderId}`);
    
          // Update the orders list
          const updatedOrders = orders.filter(order => order._id !== orderId);
          setOrders(updatedOrders);
          showSuccessToast('Delivered Success')
        } catch (error) {
          console.error('Error marking as delivered:', error);
        } finally {
          setLoading(false);
        }
      };

    return (
      <div className="order-list">
        <h2>Order List</h2>
        <div className="order-cards">
          {orders.map((order) => (
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
                    <div className="product-days">
                      Days: {products[item.productId]?.days || 'N/A'}
                    </div>
                  </div>
                </div>

                
              ))}
               <button className="deliver-button "
              onClick={() => handleDeliveredClick(order._id)}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Delivered'}
            </button>

            </div>
          ))}
          
        </div>
      </div>
    );
  };
  
  export default DisplayOrders;