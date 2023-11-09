import React, { useEffect, useState } from 'react';
import './ItemCreate.css';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ItemCreate = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const [item, setItem] = useState({
    productName: '',
    days: '',
    price: '',
    image: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  const handleImageChange = (e) => {
    const image = e.target.value;
    setItem({ ...item, image });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      if (!decodedToken.isAdmin) {
        navigate('/');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/api/prod/products`, item);
      if(response){
        setItem({
            productName: '',
            days: '',
            price: '',
            image: '',
          })
      }
      console.log('Item created successfully:', response.data);
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  return (
    <div className="form-container">
      <h2>Create a New Item</h2>
      <form className="item-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="image" className="label">
            Image URL
          </label>
          <input
            type="text"
            id="image"
            name="image"
            value={item.image}
            onChange={handleImageChange}
            className="input"
          />
          {item.image && (
            <div className="image-preview">
              <img src={item.image} alt="Item Preview" className="preview" />
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="productName" className="label">
            Rack Name
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={item.productName}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="days" className="label">
            Days
          </label>
          <input
            type="text"
            id="days"
            name="days"
            value={item.days}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="price" className="label">
            Price
          </label>
          <input
            type="text"
            id="price"
            name="price"
            value={item.price}
            onChange={handleChange}
            className="input"
          />
        </div>
        <button type="submit" className="button">
          Create Item
        </button>
      </form>
    </div>
  );
};

export default ItemCreate;
