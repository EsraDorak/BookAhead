import React from "react";
import { Link } from "react-router-dom";
import "../RegisterSelection.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore, faUser } from "@fortawesome/free-solid-svg-icons";

const RegisterSelection = () => {
  return (
    <div className="register-container">
      <nav className="navbar">
        <div className="navbar-text">Register as</div>
      </nav>
      <div className="button-container-1">
        <FontAwesomeIcon className="icon" icon={faUser} />
        <Link to="/user-register">
          <button className="register-btn">User</button>
        </Link>
      </div>
      <div className="button-container-2">
        <FontAwesomeIcon className="icon" icon={faStore} />
        <Link to="/owner-register">
          <button className="register-btn">Owner</button>
        </Link>
      </div>
    </div>
  );
};

export default RegisterSelection;