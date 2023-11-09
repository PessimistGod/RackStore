import React, { useState } from 'react';
import { adminSignup } from './Validators/BackendInterface';
import { handleEmail, handlePassword, handleConfirmPass } from './Validators/EmailAndPassword';
import './Signup.css';
import { Link } from 'react-router-dom';
import { useToast } from '../../Context/ToastContext';


const AdminSignup = () => {
  const { showSuccessToast, showErrorToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    password: '',
    confirmPass: '',
  });

  const [validation, setValidation] = useState({
    isValidEmail: false,
    isValidPass: false,
    isConfirmPass: false,
    spanEmail: '',
    spanPass: '',
    spanCPass: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEmailValidation = async (email) => {
    const message = await handleEmail(email, (isValid) => {
      setValidation((prevValidation) => ({
        ...prevValidation,
        spanEmail: isValid,
        isValidEmail: isValid,
      }));
    });

    setValidation((prevValidation) => ({
      ...prevValidation,
      spanEmail: message,
    }));
  };

  const handlePasswordValidation = (password) => {
    const message = handlePassword(password, (isValid) => {
      setValidation((prevValidation) => ({
        ...prevValidation,
        spanPass: isValid,
        isValidPass: isValid,
      }));
    });

    setValidation((prevValidation) => ({
      ...prevValidation,
      spanPass: message,
    }));
  };

  const handleConfirmPasswordValidation = (confirmPass) => {
    const message = handleConfirmPass(
      formData.password,
      confirmPass,
      (isValid) => {
        setValidation((prevValidation) => ({
          ...prevValidation,
          spanCPass: isValid,
          isConfirmPass: isValid,
        }));
      }
    );

    setValidation((prevValidation) => ({
      ...prevValidation,
      spanCPass: message,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValidEmail, isValidPass, isConfirmPass } = validation;

    if (isValidEmail && isValidPass && isConfirmPass) {
      const response = await adminSignup(formData);
      if (response) {
        // Signup successful
        setFormData({
            name: '',
            company: '',
            email: '',
            password: '',
            confirmPass: '',
          })
          setValidation({
            isValidEmail: false,
            isValidPass: false,
            isConfirmPass: false,
            spanEmail: '',
            spanPass: '',
            spanCPass: '',
          })
          showSuccessToast('Signup successful')
      } else {
        // Error signing up
        showErrorToast('Check Credentials')
      }
    } else {
      // Form validation failed
      showErrorToast('Form validation failed')
    }
  };

  return (
    <div className="signup-container">
      <h2>Create Your Account</h2>
      <form className='form-container-signup' onSubmit={handleSubmit}>
        <div className="form-group-signup">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group-signup">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              handleEmailValidation(e.target.value);
            }}
          />
          {validation.spanEmail && <span className="error">{validation.spanEmail}</span>}
        </div>
        <div className="form-group-signup">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              handlePasswordValidation(e.target.value);
            }}
          />
          {validation.spanPass && <span className="error">{validation.spanPass}</span>}
        </div>
        <div className="form-group-signup">
          <label htmlFor="confirmPass">Confirm Password</label>
          <input
            type="password"
            id="confirmPass"
            name="confirmPass"
            value={formData.confirmPass}
            onChange={(e) => {
              setFormData({ ...formData, confirmPass: e.target.value });
              handleConfirmPasswordValidation(e.target.value);
            }}
          />
          {validation.spanCPass && <span className="error">{validation.spanCPass}</span>}
        </div>
        <button type="submit" className="btn-signup">
          Sign Up
        </button>

        <div className='flexCenter member-signup'>Already a Member? <Link className='link-signup-style' to={'/login'}>Login</Link></div>
      </form>
    </div>
  );
};

export default AdminSignup;
