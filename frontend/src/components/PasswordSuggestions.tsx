import React from "react";
import "../PasswordSuggestions.css";

interface PasswordSuggestionsProps {
  password: string;
}

const PasswordSuggestions: React.FC<PasswordSuggestionsProps> = ({ password }) => {
  const suggestions = [
    { text: "8+ characters", valid: password.length >= 8 },
    { text: "Uppercase letter", valid: /[A-Z]/.test(password) },
    { text: "Lowercase letter", valid: /[a-z]/.test(password) },
    { text: "Number", valid: /\d/.test(password) },
    { text: "Special character", valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  return (
    <div className="password-suggestions">
      <p>Password must include:</p>
      <ul className="suggestions-list">
        {suggestions.map((suggestion, index) => (
          <li key={index} className={`suggestion-item ${suggestion.valid ? "valid" : "invalid"}`}>
            {suggestion.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordSuggestions;
