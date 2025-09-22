import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import EmailConfirmation from './components/EmailConfirmation';
import ActivationSuccess from './components/ActivationSuccess';
import './index.css';

// Component Wrapper để xử lý navigate từ các component con
const AuthWrapper = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [isEmailConfirmationView, setIsEmailConfirmationView] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate(); // Sử dụng useNavigate hook

  const toggleToSignup = () => {
    setIsLoginView(false);
    setIsEmailConfirmationView(false);
    navigate('/signup'); // Chuyển hướng đến /signup
  };

  const toggleToLogin = () => {
    setIsLoginView(true);
    setIsEmailConfirmationView(false);
    navigate('/login'); // Chuyển hướng đến /login
  };

  const handleSignupSuccess = (email) => {
    setIsEmailConfirmationView(true);
    setIsLoginView(false); // Đảm bảo Login không hiển thị
    setUserEmail(email);
    navigate('/email-confirmation'); // Chuyển hướng đến /email-confirmation
  };

  const handleContinueFromActivation = () => {
    navigate('/login'); // Sau khi kích hoạt thành công, chuyển về trang login
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={isLoginView ? <Login onToggleView={toggleToSignup} /> : <Signup onToggleView={toggleToLogin} onSignupSuccess={handleSignupSuccess} />} />
        <Route path="/login" element={<Login onToggleView={toggleToSignup} />} />
        <Route path="/signup" element={<Signup onToggleView={toggleToLogin} onSignupSuccess={handleSignupSuccess} />} />
        <Route path="/email-confirmation" element={<EmailConfirmation onToggleView={toggleToLogin} userEmail={userEmail} />} />
        <Route 
          path="/activation-success" 
          element={<ActivationSuccess onContinue={handleContinueFromActivation} />} 
        />
        {}
        <Route path="/activation-error" element={<div>Lỗi kích hoạt tài khoản. Vui lòng thử lại hoặc liên hệ hỗ trợ.</div>} />
      </Routes>
    </div>
  );
};


function App() {
  return (
    <Router>
      <AuthWrapper />
    </Router>
  );
}

export default App;