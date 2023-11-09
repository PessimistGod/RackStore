import React, { useEffect, useState } from 'react';
import './Style/Home.css';
import { useCart } from '../Context/CartContext';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useToast } from '../Context/ToastContext';

const Home = () => {
  const { cart, setCart, fetchCartItemCount } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState('');
  const API_URL = process.env.REACT_APP_API_URL;

  const { showSuccessToast, showErrorToast } = useToast();
  useEffect(() => {

    const fetchData = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        navigate('/login');
        return;
      }

      const decodedToken = jwtDecode(storedToken);
      setUserId(decodedToken.id);

      try {
        const response = await axios.get(`${API_URL}/api/prod/products`);
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [navigate, API_URL]);

  const handleAddToCart = async (productId) => {
    try {
      await axios.post(`${API_URL}/api/cart/add-to-cart`, {
        userId,
        productId,
      });

      setCart([...cart, productId]);
      fetchCartItemCount();
      showSuccessToast('Rack Added to Cart')
    } catch (error) {
      showErrorToast('Error Adding Rack')

      console.error('Error adding product to cart:', error);
    }
  };

  return (
    <div className="home-container">
      {products
        .filter((product) => product.availability) 
        .map((product) => (
          <div className="card" key={product._id}>
            <img src={product.image} alt={product.name} />
            <div className="card-details">
              <h3>{product.name}</h3>
              <p>Price: ₹{product.price}</p>
              <p>Days: {product.days}</p>
              <p>Location: {product.city},{product.state}</p>


              <button onClick={() => handleAddToCart(product._id)}>
                Purchase Rack
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Home;
