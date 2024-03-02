import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import styles from './Style/Cart.module.css';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../Context/CartContext';
import { useToast } from '../Context/ToastContext';
import StripeCheckout from 'react-stripe-checkout';

const Cart = () => {
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast } = useToast();

  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL;
  const { fetchCartItemCount } = useCart();


  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      navigate('/login');
      return;
    }

    const decodedToken = jwtDecode(storedToken);
    setUserId(decodedToken.id);

    const fetchUserCart = async () => {
      try {
        if (userId) {
          const response = await axios.get(`${API_URL}/api/cart/user/${userId}`);
          const filteredCartItems = response.data.filter(item => item?.productId?.availability);
          setCartItems(filteredCartItems);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user cart:', error);
        setIsLoading(false);
      }
    };

    fetchUserCart();
  }, [navigate, API_URL, userId]);

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`${API_URL}/api/cart/${itemId}`);
      setCartItems((items) => items.filter((item) => item._id !== itemId));
      fetchCartItemCount();
      showSuccessToast('Item Deleted');
    } catch (error) {
      showErrorToast('Error deleting');
      console.error('Error deleting item:', error);
    }
  };



  const handleIncreaseQuantity = async (itemId) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item._id === itemId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCartItems(updatedCartItems);

    try {
      await axios.put(`${API_URL}/api/cart/increase/${itemId}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDecreaseQuantity = async (itemId) => {
    if (cartItems.find((item) => item._id === itemId)?.quantity > 1) {
      const updatedCartItems = cartItems.map((item) => {
        if (item._id === itemId) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
      setCartItems(updatedCartItems);

      try {
        await axios.put(`${API_URL}/api/cart/decrease/${itemId}`);
      } catch (error) {
        console.error(error);
      }
    }
  };
  
  
  const subTotal = cartItems.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);

  const clearUserCart = async (userId) => {
    try {
      const response = await axios.post(`${API_URL}/api/cart/clear/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };


  const handleCheckout = async () => {
    try {
      const checkoutResponse = await axios.post(`${API_URL}/api/stripe/checkout`, {
        cartItems,
        userId
      });
  
      const checkoutUrl = checkoutResponse.data.url;
  
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error('Failed to get checkout URL');
      }
    } catch (error) {
      console.error('Error during checkout:', error.message);
      showErrorToast('Error during checkout');
    }
  };
  

  return (
    <div className={styles.cart_container}>
      <h2>Rack Cart</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.table_container}>
          <table className={styles.cart_table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((cartItem) => (
                // Check if the product has availability set to true
                cartItem?.productId?.availability && (
                  <tr key={cartItem._id} className={styles.cart_item}>
                    <td>{cartItem?.productId?.productName}</td>
                    <td>{cartItem?.productId?.price}</td>
                    <td>{cartItem?.quantity}</td>
                    <td>
                      <button onClick={() => handleIncreaseQuantity(cartItem._id)}>
                        <FaPlus />
                      </button>
                      <button
                        onClick={() => handleDecreaseQuantity(cartItem._id)}
                        disabled={cartItem?.quantity === 1}
                      >
                        <FaMinus />
                      </button>
                      <button onClick={() => handleDelete(cartItem._id)}>Delete</button>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      )}
      
        <button className={styles.checkout_button_main} onClick={handleCheckout}>Checkout</button>
    </div>
  );
};

export default Cart;
