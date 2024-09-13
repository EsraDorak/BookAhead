import React, { useState } from 'react';
import '../res.css';
import { useOwner } from './OwnerContext';
import PopUp from './PopUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


const AddRestaurant: React.FC = () => {
  const { owner } = useOwner();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [menuImages, setMenuImages] = useState<File[]>([]);
  const [openingHours, setOpeningHours] = useState('');
  const [stars, setStars] = useState(1); // Initialize to 1
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setImageFunc: React.Dispatch<React.SetStateAction<File[]>>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files);
      setImageFunc((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const handleClearImages = (setImageFunc: React.Dispatch<React.SetStateAction<File[]>>) => {
    setImageFunc([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || images.length === 0 || !openingHours || stars === 0 || !address || !phoneNumber || !owner?.restaurantName) {
      setPopupMessage('Please fill in all required fields.');
      setShowPopup(true);
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }
    for (let i = 0; i < menuImages.length; i++) {
      formData.append('menuImages', menuImages[i]);
    }
    formData.append('openingHours', openingHours);
    formData.append('stars', stars.toString());
    formData.append('address', address);
    formData.append('phoneNumber', phoneNumber);
    formData.append('ownerName', owner.restaurantName);

    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:5002/restaurants/add`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error adding restaurant');
      }

      const data = await response.json();
      setPopupMessage('Restaurant added successfully!');
      setShowPopup(true);
    } catch (error) {
      console.error('Error adding restaurant:', error);
      setPopupMessage(`Error adding restaurant: ${(error as Error).message}`);
      setShowPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    if (popupMessage === 'Restaurant added successfully!') {
      window.location.href = '/owner-homepage';
    }
  };
  const handleBackClick = () => {
    navigate(-1); // Geht zur vorherigen Seite zurück
  };

  return (
    <div className="body-login">
    <div className="container-add-restaurant">
    <button onClick={handleBackClick} className="back-button-1">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
    <h1>Add New Restaurant</h1>
      <form className="formAdd" onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
        <div className="file-input">
        <label htmlFor="file">Restaurant Bilder hochladen:</label>

          <input id="file" type="file" onChange={(e) => handleImageChange(e, setImages)} accept="image/*" multiple required />
          {images.length > 0 && (
            <div className="selected-files">
              <ul>
                {images.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
              <button type="button" onClick={() => handleClearImages(setImages)}>Clear</button>
            </div>
          )}
        </div>
        <div className="file-input">
  <label htmlFor="file">Menübilder hochladen:</label>
  <input id="file" type="file" onChange={(e) => handleImageChange(e, setMenuImages)} accept="image/*" multiple />
  {menuImages.length > 0 && (
    <div className="selected-files">
      <ul>
        {menuImages.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
      <button type="button" onClick={() => handleClearImages(setMenuImages)}>Clear</button>
    </div>
  )}
</div>

        <input type="text" value={openingHours} onChange={(e) => setOpeningHours(e.target.value)} placeholder="Opening Hours - Like 10:00 - 16:00" required />
        <input
          type="number"
          value={stars}
          onChange={(e) => setStars(Math.max(1, Number(e.target.value)))}
          placeholder="Stars"
          min="1"
          max="5"
          required
        />
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" required />
        <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" required />
        <button type="submit" disabled={isSubmitting}>Add Restaurant</button>
      </form>
      {showPopup && (
        <PopUp
          message={popupMessage}
          onClose={closePopup}
        />
      )}
    </div>
    </div>
  );
};

export default AddRestaurant;
