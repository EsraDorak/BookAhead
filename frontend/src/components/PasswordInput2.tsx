import React, { useState } from 'react';

interface PasswordInput2Props {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    password: string;
    passwordMatch: boolean; // Add passwordMatch prop to the interface
}

export const PasswordInput2: React.FC<PasswordInput2Props> = ({ value, onChange, password, passwordMatch }) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [backgroundColor, setBackgroundColor] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.trim();

        onChange(e); // Propagate input change

        // Compare input value with password
        if (inputValue === password) {
            // setBackgroundColor('green');
        } else {
            // setBackgroundColor('red');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    return (
        <div className="password-input">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
            {/* <div className="input-container">
                <input placeholder='Confirm Password' type={showPassword ? "text" : "password"} value={value} onChange={handleInputChange} style={{ background: backgroundColor }} /> */}
                <div className="input-container">
                <input
                placeholder="Confirm Password"
                className="password-field" 
                type={showPassword ? "text" : "password"} value={value} onChange={handleInputChange} style={{ background: backgroundColor }}
            />
                  <button type="button" onClick={togglePasswordVisibility} className="toggle-button">
                {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
            </button>
            </div>
            {/* {passwordMatch ? null : <div>Passwords do not match</div>} */}
        </div>
    );
}


export default PasswordInput2;