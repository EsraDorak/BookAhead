import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../RegisterUser.css";
import PasswordInput2 from "./PasswordInput2";
import PasswordInput from "./PasswordInput";
import logo_icon from "../images/logo.png";
import PopUp from "./PopUp";
import validator from "validator";
import PasswordSuggestions from "./PasswordSuggestions";


export function Register() {
  const [name, setName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [submitClicked, setSubmitClicked] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>("");
  const navigate = useNavigate();
  
  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitClicked(true);
    setError("");

    if (!name || !lastName || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!validator.isStrongPassword(password)) {
      setError("Password must be a strong password.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMatch(false);
      setError("Passwords do not match.");
      return;
    }

    setPasswordMatch(true);

    try {
      const response = await fetch(`http://localhost:5002/api/users/register`, {
        method: "POST",
        body: JSON.stringify({
          name,
          lastName,
          email,
          password,
          confirmPassword,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        setIsRegistered(true);
        setPopupMessage("Registration successful!");
        setShowPopup(true);
        setTimeout(() => {
          navigate("/", { state: { message: "A verification email has been sent to your email address. Please check your inbox" } });
        }, 2000);
      } else if (
        response.status === 400 &&
        result.message === "Email already in use"
      ) {
        setError("This email address is already registered. Please use a different email address.");
      } else if (
        response.status === 400 &&
        result.message === "Passwords do not match"
      ) {
        setError("Passwords do not match.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="body-login">
      <div id="con">
        {!isRegistered && (
          <form onSubmit={handleOnSubmit} className="register-form">
            <div className="logo">
              <img id="logoRichtig" src={logo_icon} alt="Logo" width="250" />
            </div>
            <div className="header">
              <div className="text">Register</div>
              <div className="under"></div>
            </div>
            <div className="inputs-register">
              <div className="input-register">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="input-register">
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div className="input-register">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-register">
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  confirmPassword={confirmPassword}
                  onPasswordMatchChange={setPasswordMatch}
                />
              </div>

              <div className="input-register">
                <PasswordInput2
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  password={password}
                  passwordMatch={passwordMatch}
                />
              </div>
              <PasswordSuggestions password={password} />
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="submit-container">
              <button className="submit" type="submit">
                Submit
              </button>
            </div>
          </form>
        )}
        {showPopup && <PopUp message={popupMessage} onClose={closePopup} />}
      </div>
    </div>
  );
}

export default Register;
