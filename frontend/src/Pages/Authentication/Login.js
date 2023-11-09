import React, { useEffect, useState } from 'react';
import { loginUser } from './Validators/BackendInterface';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useToast } from '../../Context/ToastContext';

const Login = () => {
  const { showSuccessToast, showErrorToast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const tokenMain = localStorage.getItem('token');
    if (tokenMain) {
      const decodedTokenMain = jwtDecode(tokenMain);
      if (decodedTokenMain.isAdmin) {
        navigate('/admin-orders');
      } else if (decodedTokenMain.id && !decodedTokenMain.isAdmin) {
        navigate('/');
      }
    }
  }, [navigate]);
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await loginUser(formData);
  
      if (response && response.token) {
        // Login successful
        const token = response.token;
        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token);
        setFormData({
          email: '',
          password: '',
        });
  
        if (decodedToken.isAdmin) {
          navigate('/admin-orders');
        } else if (decodedToken.id && !decodedToken.isAdmin) {
          navigate('/');
        }
  
        setTimeout(() => {
          showSuccessToast('Login Successful');
        }, 600);
      } else {
        // Handle other response conditions
        setTimeout(() => {
          showErrorToast('Check Credentials');
        }, 600);
      }
    } catch (error) {
      // Handle the 401 error
      if (error.response && error.response.status === 401) {
        showErrorToast('Check your credentials');
      } else {
        // Handle other errors
        console.error('Login error:', error);
      }
    }
  };
  

  return (
    <div className="login-container">
      <h2>Login to Your Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn-login">
          Login
        </button>
      </form>
      <div className='flexCenter member-login'>Not a Member? <Link className='link-login-style' to={'/signup'}>Signup</Link></div>

    </div>
  );
};

export default Login;
