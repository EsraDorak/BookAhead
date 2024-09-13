import React, { useState, useEffect } from 'react';

interface PasswordInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    confirmPassword: string;
    onPasswordMatchChange: React.Dispatch<React.SetStateAction<boolean>>; // Add onPasswordMatchChange prop to the interface
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChange, confirmPassword, onPasswordMatchChange }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState('');

    useEffect(() => {
        // Compare passwords and update background color accordingly
        if (confirmPassword !== '' && value !== confirmPassword) {
            onPasswordMatchChange(false);
            // setBackgroundColor('red');
        } else {
            onPasswordMatchChange(true);
            // setBackgroundColor('green');
        }
    }, [value, confirmPassword, onPasswordMatchChange]);

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    return (
        <div className="password-input">
            <div className="input-container">
                <input
                    placeholder="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    className="password-field" 
                    style={{ background: confirmPassword !== '' ? backgroundColor : '' }}
                />
                <button type="button" onClick={togglePasswordVisibility} className="toggle-button">
                    {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                </button>
            </div>
        </div>
    );
    }
    

export default PasswordInput;