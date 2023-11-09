import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useToast } from '../../Context/ToastContext';

const ManageRack = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const { showSuccessToast, showErrorToast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      if (!decodedToken.isAdmin) {
        navigate('/login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        navigate('/login');
        return;
      }
      try {
        const response = await axios.get(`${API_URL}/api/prod/products`);
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [navigate, API_URL]);

  console.log(products)

  const handleAvailability = async (productId, availability) => {
    try {
      await axios.put(`${API_URL}/api/prod/products/${productId}`, { availability });
      const response = await axios.get(`${API_URL}/api/prod/products`);
      setProducts(response.data);
      showSuccessToast('Changed Availability Setting')
    } catch (error) {
        showErrorToast("Error Fetching Try Later")
      console.error('Error updating availability:', error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`${API_URL}/api/prod/products/${productId}`);
      // Fetch updated products after deletion
      const response = await axios.get(`${API_URL}/api/prod/products`);
      setProducts(response.data);
      showSuccessToast('Product Deleted')
    } catch (error) {
        showErrorToast("Error Fetching Try Later")

      console.error('Error deleting product:', error);
    }
  };
  

  return (
    <div className="home-container">
      {products.map((product) => (
        <div className="card" key={product._id}>
          <img src={product.image} alt={product.productName} />
          <div className="card-details">
            <h3>{product.productName}</h3>
            <p>Price: ₹{product.price}</p>
            <p>Days: {product.days}</p>
            <p>Location: {product.city}, {product.state}</p>
          </div>
          <div>
            <button className='btn-availability' onClick={() => handleAvailability(product._id, !product.availability)}>
              {product.availability ? 'Make Unavailable' : 'Make Available'}
            </button>
            <button className='btn-delete-product' onClick={() => handleDelete(product._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageRack;
