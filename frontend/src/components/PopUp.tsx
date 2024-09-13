import React from 'react';
import '../PopUp.css'; // Make sure to create this CSS file

interface PopUpProps {
  message: string;
  onClose: () => void;
}

const PopUp: React.FC<PopUpProps> = ({ message, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default PopUp;