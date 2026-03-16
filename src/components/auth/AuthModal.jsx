import React, { useState } from 'react';
import { X } from 'lucide-react';
import Login from '../../pages/Auth/Login.jsx';
import Register from '../../pages/Auth/Register.jsx';
import ForgotPassword from '../../pages/Auth/ForgotPassword.jsx';

const AUTH_MODES = {
  LOGIN: 'login',
  REGISTER: 'register',
  FORGOT: 'forgot',
};

const AuthModal = ({ onClose, initialMode, onModeChange }) => {
  const [mode, setMode] = useState(initialMode);

  const switchMode = (newMode) => {
    setMode(newMode);
    onModeChange(newMode);
  };

  const renderAuthComponent = () => {
    switch(mode) {
      case AUTH_MODES.LOGIN:
        return <Login onModeChange={switchMode} onClose={onClose} />;
      case AUTH_MODES.REGISTER:
        return <Register onModeChange={switchMode} />;
      case AUTH_MODES.FORGOT:
        return <ForgotPassword onModeChange={switchMode} />;
      default:
        return <Login onModeChange={switchMode} onClose={onClose} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white  rounded-lg shadow-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <X size={24} />
        </button>
        
        <div className="p-8">
          {renderAuthComponent()}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;