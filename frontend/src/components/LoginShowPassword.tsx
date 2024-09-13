import React, { useState } from 'react';
import '../LoginShowPassword.css'; // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LoginShowPassword: React.FC<PasswordInputProps> = ({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };
  return (
    <div className="password-input">
      <div id="contain">
        <input
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
        />
        <button type="button" id="toggle-button" onClick={togglePasswordVisibility}>
        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="eye-icon" />
        </button>
      </div>
    </div>
  );
};



export default LoginShowPassword;