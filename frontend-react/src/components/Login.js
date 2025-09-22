import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = ({ onToggleView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email: email,
        password: password
      });
      // Lưu token vào localStorage sau khi đăng nhập thành công
      localStorage.setItem('token', response.data.token);
      alert('Đăng nhập thành công!');
      // Có thể chuyển hướng người dùng tới trang dashboard tại đây
    } catch (error) {
      const message = error.response?.data?.msg || 'Login fail. Try again';
      alert(message);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Log in</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <i className="fas fa-eye-slash"></i>
            ) : (
              <i className="fas fa-eye"></i>
            )}
          </span>
        </div>
        <a href="#" className="forgot-password">Forgot password?</a>
        <button type="submit" className="login-btn">Log in</button>
      </form>
      <div className="signup-link">
        <span>Don't have an account?</span>
        <a href="#" onClick={onToggleView}>Sign up</a>
      </div>
    </div>
  );
};

export default Login;