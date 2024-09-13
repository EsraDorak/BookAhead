import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import "../loginstyle.css";
import { useOwner } from "./OwnerContext";
import logo_icon from "../images/logo.png";
import LoginShowPassword from "./LoginShowPassword";
import PopUp from "./PopUp"; // Import the PopUp component

export function OwnerLogin() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>(""); // State to hold the popup message
  const [showPopup, setShowPopup] = useState<boolean>(false); // State to control the popup visibility
  const { setOwner } = useOwner(); // Use the setOwner function from context
  const navigate = useNavigate(); // Initialize useNavigate


  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    try {
      const response = await fetch(`http://localhost:5002/login/owner`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Owner data received:", data); // Debug log
        setOwner({ id: data.id, restaurantName: data.name }); // Set the owner context
        setMessage(`Welcome ${data.name}`); // Set welcome message
        setShowPopup(true); // Show popup
        setTimeout(() => {
          navigate("/owner-homepage"); // Redirect to owner dashboard page after a delay
        }, 2000);
      } else {
        const errorResult = await response.json();
        setMessage(errorResult.message || "Login failed"); // Set error message
        setShowPopup(true); // Show popup
      }
    } catch (error) {
      setMessage("An unexpected error occurred. Please try again."); // Set error message
      setShowPopup(true); // Show popup
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="body-login">
      <div className="container">
        <div className="logo">
          <img src={logo_icon} alt="Logo" width="300" />
        </div>
        <div className="header">
          <div className="text">Log In</div>
          <div className="text">Owner</div>
          <div className="underline"></div>
        </div>
        <form className="inputs" onSubmit={handleOnSubmit}>
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
            <Link to="/owner-register">
              <div className="submit-signup">Sign Up</div>
            </Link>
          </div>
          <div className="user-link">
            <p style={{ color: 'white' }}>Are you an User?</p>
            <Link to="/loginU" className="user-login-link">
              User Login
            </Link>
          </div>
        </form>
      </div>
      {showPopup && <PopUp message={message} onClose={handleClosePopup} />}
    </div>
  );
}

export default OwnerLogin;
