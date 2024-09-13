// Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../loginstyle.css';
import logo from '../images/logo.png';
import LoginShowPassword from './LoginShowPassword';
import PopUp from './PopUp'; // Stellen Sie sicher, dass der Pfad zu PopUp.tsx korrekt ist

export function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [userData, setUserData] = useState<any>(null); 
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>(''); 
  const navigate = useNavigate();



  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      let result = await fetch(`http://localhost:5002/api/users/login`, {
        method: 'post',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Fetch result:', result);

      if (result.ok) {
        const data = await result.json();
        console.log('Server response data:', data);

  
        // Überprüfe den isVerified Status
        console.log('isVerified:', data.isVerified);

        if (data && data._id && data.name && data.email) {
          if (data.isVerified) {
            console.log('User data:', data);

            setIsLoggedIn(true);
            setUserName(data.name);
            setUserData(data);
            setPopupMessage(`Welcome ${data.name}`);
            setShowPopup(true);

            setTimeout(() => {
              navigate('/restaurants-page', { state: { user: data } });
            }, 2000); // Anpassen der Verzögerung nach Bedarf
          } else {
            setPopupMessage('Email is not verified. Please verify your email before logging in.');
            setShowPopup(true);
          }
        } else {
          console.warn('User data is missing or malformed');
          setPopupMessage('User data is missing or malformed');
          setShowPopup(true);
        }
      } else {
        const errorResult = await result.json();
        console.log('Error result from server:', errorResult);
        setPopupMessage(errorResult.message || 'Login failed');
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setPopupMessage('Error logging in. Please try again.');
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="body-login">
      <div className="container">
        <div className="logo">
          <img src={logo} alt="Logo" width="300" />
        </div>
        <div className="header">
          <div className="text">Log In</div>
          <div className="underline"></div>
        </div>
        <form className="inputs" onSubmit={handleOnSubmit}>
          {error && <div className="error">{error}</div>}
          <div className="inputLogin">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="inputLogin">
            <LoginShowPassword
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="submit-container-login">
            <button type="submit" className="submit">
              Login
            </button>
            <Link to="/register-selection">
              <div className="submit-signup">Sign Up</div>
            </Link>
          </div>
        </form>
        <div className="owner-link">
          <p style={{ color: 'white' }}>Are you an owner?</p>
          <Link to="/login-owner" className="owner-login-link">
            Owner Login
          </Link>
        </div>

        {showPopup && <PopUp message={popupMessage} onClose={closePopup} />}

        {/* Beispiel für die Nutzung von isLoggedIn, userName und userData */}
        {isLoggedIn && userName && (
          <div>
            <p>User: {userName}</p>
            <p>Email: {userData?.email}</p>
            <p>Password: {userData?.password}</p>
            <p>ID: {userData?._id}</p>
            {/* Zusätzliche Benutzerinformationen */}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
