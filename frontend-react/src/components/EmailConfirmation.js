import React from 'react';
import './Login.css';

const EmailConfirmation = ({ onToggleView, userEmail }) => {
  return (
    <div className="login-container">
      <h2 className="login-title">Please confirm your email address</h2>
      <div className="confirmation-content">
        <p>We have send a confirmation link to: </p>
        <p><b>{userEmail}</b></p>
        <p>Confirmation email may take up 5 minutes to appear in your inbox</p>
        <p>Please confirm through the link in the email to create your account</p>
      </div>
      <button className="login-btn">Resend email</button>
      <a href="#" className="back-link" onClick={onToggleView}>
        ←  Back to Login
      </a>
    </div>
  );
};

export default EmailConfirmation;