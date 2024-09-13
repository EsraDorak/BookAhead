import React from 'react';
import '../PopUp.css';

interface PopUpProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

const PopUpselect: React.FC<PopUpProps> = ({ message, show, onClose }) => {
  if (!show) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default PopUpselect;
