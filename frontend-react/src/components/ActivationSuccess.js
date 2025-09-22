import React from 'react';
import './ActivationSuccess.css'; 

const ActivationSuccess = ({ onContinue }) => {
  return (
    <div className="activation-success-container">
      <div className="icon-wrapper">
        {}
        <svg
          className="check-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
        >
          <circle cx="26" cy="26" r="25" fill="none" />
          <path
            fill="none"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
          />
        </svg>
      </div>
      <h2 className="thank-you-title">Thank you!</h2>
      <p className="confirmation-message">Your email address has been confirmed.</p>
      <button className="continue-button" onClick={onContinue}>
        Continue with account creation
      </button>
    </div>
  );
};

export default ActivationSuccess;