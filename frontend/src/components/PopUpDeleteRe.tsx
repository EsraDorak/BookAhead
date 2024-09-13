
import React from 'react';
import '../PopUp.css'; // Make sure to create this CSS file

interface PopUpProps {
  message: string;
  onClose: () => void;
  onConfirm: () => void; // Add the onConfirm prop
}

const PopUpDelete: React.FC<PopUpProps> = ({ message, onClose, onConfirm }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <p>{message}</p>
        <button onClick={onConfirm}>Confirm</button> {/* Use the onConfirm prop */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default PopUpDelete;
