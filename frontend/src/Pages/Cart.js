import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './Style/Cart.css';
import { FaPlus, FaMinus } from 'react-icons/fa';
import Checkout from './Checkout';
import { useCart } from '../Context/CartContext';
import { useToast } from '../Context/ToastContext';

const Cart = () => {
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast } = useToast();

  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { fetchCartItemCount } = useCart();

  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
  });

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
      showSuccessToast('Item Deleted')
    } catch (error) {
        showErrorToast('Error deleting')
      console.error('Error deleting item:', error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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

  const handleUserDetailsChange = (field, value) => {
    setUserDetails((prevUserDetails) => ({ ...prevUserDetails, [field]: value }));
  };

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
    const orderData = {
      userDetails: userDetails,
      cartItems: cartItems,
      userId:userId,
    };
  
    try {
      // Set order history and make products unavailable
      const orderHistoryResponse = await axios.post(`${API_URL}/api/orders/set-order-history`, orderData);
  
      if (orderHistoryResponse.data.message === 'Order placed successfully') {
        // Create a new order with userId
        const newOrderData = {
          userDetails: userDetails,
          cartItems: cartItems,
        };
  
        const newOrderResponse = await axios.post(`${API_URL}/api/orders/new-order`, newOrderData);
  
        if (newOrderResponse.data.message === 'Order placed successfully') {
          // Clear user cart
          const clearCartResponse = await clearUserCart(userId);
  
          if (clearCartResponse.message === 'Cart cleared successfully') {
            setCartItems([]);
            fetchCartItemCount();
          }
  
          setUserDetails({
            name: '',
            email: '',
            phoneNumber: '',
            address: '',
          });

          setTimeout(() => {
            showSuccessToast('Rack Purchased')
          }, 700);
          navigate('/order-placed');
        }
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };
  

  return (
    <div className="cart-container">
      <h2>Rack Cart</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-container">
          <table className="cart-table">
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
                  <tr key={cartItem._id} className="cart-item">
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
      <button className="checkout-button-main" onClick={openModal}>
        Checkout
      </button>
      <Checkout
        userDetails={userDetails}
        handlePay={handleCheckout}
        handleClose={closeModal}
        handleUserDetailsChange={handleUserDetailsChange}
        isModalOpen={isModalOpen}
      />
    </div>
  );
};

export default Cart;
