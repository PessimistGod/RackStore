import React from 'react';
import './Style/Checkout.css';

const Checkout = ({
    userDetails,
    handlePay,
    handleClose,
    handleUserDetailsChange,
    isModalOpen,
}) => {
    return isModalOpen ? (
        <div className="checkout-modal-container">
            <div className="modal-content">
                <span className="close" onClick={handleClose}>
                    &times;
                </span>
                <h3>Enter Your Details</h3>
                <input
                    type="text"
                    placeholder="Name"
                    value={userDetails.name}
                    onChange={(e) =>
                        handleUserDetailsChange('name', e.target.value)
                    }
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={userDetails.email}
                    onChange={(e) =>
                        handleUserDetailsChange('email', e.target.value)
                    }
                />
                <input
                    type="text"
                    placeholder="Phone Number"
                    value={userDetails.phoneNumber}
                    onChange={(e) =>
                        handleUserDetailsChange('phoneNumber', e.target.value)
                    }
                />
                <input
                    type="text"
                    placeholder="Address"
                    value={userDetails.address}
                    onChange={(e) =>
                        handleUserDetailsChange('address', e.target.value)
                    }
                />
                <button className="checkout-button-pay" onClick={handlePay}>
                    Pay
                </button>
            </div>
        </div>
    ) : null;
};

export default Checkout;
