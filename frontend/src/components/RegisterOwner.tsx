import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import PasswordInput2 from "./PasswordInput2";
import PasswordInput from "./PasswordInput";
import logo_icon from "../images/logo.png";
import "../RegisterOwner.css";
import PasswordSuggestions from "./PasswordSuggestions";
import PopUp from "./PopUp";

export function OwnerRegister() {
  const [restaurantName, setRestaurantName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [submitClicked, setSubmitClicked] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(""); // State for popup message
  const [showPopup, setShowPopup] = useState<boolean>(false); // State for controlling popup visibility
  const navigate = useNavigate(); // Initialize useNavigate

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitClicked(true);
    setMessage(""); // Reset message

    // Validate fields
    if (
      !restaurantName ||
      !address ||
      !postalCode ||
      !city ||
      !phoneNumber ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setMessage("All fields are required.");
      setShowPopup(true); // Show popup
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMatch(false);
      setMessage("Passwords do not match.");
      setShowPopup(true); // Show popup
      return;
    }

    setPasswordMatch(true);

    try {
      const response = await fetch(`http://localhost:5002/registerOwner`, {
        method: "POST",
        body: JSON.stringify({
          restaurantName,
          address,
          postalCode,
          city,
          phoneNumber,
          email,
          password,
          confirmPassword,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (
        response.status === 400 &&
        result.message === "Email already in use"
      ) {
        setMessage(
          "This email address is already registered. Please use a different email address."
        );
        setShowPopup(true); // Show popup
      } else if (
        response.status === 400 &&
        result.message === "Passwords do not match"
      ) {
        setMessage("Passwords do not match.");
        setShowPopup(true); // Show popup
      } else if (response.status === 200) {
        setIsRegistered(true);
        setMessage("Registration successful!");
        setShowPopup(true); // Show popup
        setTimeout(() => {
          navigate("/login-owner"); // Redirect to owner login page after a delay
        }, 2000);
      } else {
        setMessage("Registration failed. Please try again.");
        setShowPopup(true); // Show popup
      }
    } catch (error) {
      console.error('Error:', error); // Logge den Fehler für mehr Details
      setMessage("An unexpected error occurred. Please try again.");
      setShowPopup(true); // Show popup
    }
    
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="body-login">
      <div className="container-register-owner">
        {!isRegistered && (
          <form onSubmit={handleOnSubmit}>
            <div className="logo">
              <img id="logoRichtig" src={logo_icon} alt="Logo" width="300" />
            </div>
            <div className="header">
              <div className="text">Register Owner</div>
              <div className="underline"></div>
            </div>
            <div className="inputs">
              <div className="inputRegister">
                <input
                  type="text"
                  placeholder="Restaurant Name"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  required
                />
              </div>

              <div className="inputRegister">
                <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="inputRegister">
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </div>

              <div className="inputRegister">
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              <div className="inputRegister">
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>

              <div className="inputRegister">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="inputRegister">
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  confirmPassword={confirmPassword}
                  onPasswordMatchChange={setPasswordMatch}
                />
              </div>

              <div className="inputRegister">
                <PasswordInput2
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  password={password}
                  passwordMatch={passwordMatch}
                />
              </div>
              <PasswordSuggestions password={password} />
            </div>
            {!passwordMatch && (
              <p style={{ color: "red" }}>Passwords do not match</p>
            )}
            <div className="submit-container">
              <button className="submit" type="submit">
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
      {showPopup && <PopUp message={message} onClose={handleClosePopup} />}
    </div>
  );
}

export default OwnerRegister;
