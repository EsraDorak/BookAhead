import React, { useState, useEffect } from 'react';
import '../EditRestaurant.css';

interface EditRestaurantProps {
  restaurant: Restaurant;
  onSave: (updatedRestaurant: Restaurant) => void;
  onCancel: () => void;
}

interface Restaurant {
  _id: string;
  name: string;
  description: string;
  address: string;
  phoneNumber: string;
  openingHours: string;
  stars: number;
  images: string[]; // Updated to handle multiple images
}

const EditRestaurant: React.FC<EditRestaurantProps> = ({ restaurant, onSave, onCancel }) => {
  const [name, setName] = useState(restaurant.name);
  const [description, setDescription] = useState(restaurant.description);
  const [address, setAddress] = useState(restaurant.address);
  const [phoneNumber, setPhoneNumber] = useState(restaurant.phoneNumber);
  const [openingHours, setOpeningHours] = useState(restaurant.openingHours);
  const [stars, setStars] = useState(restaurant.stars);
  const [images, setImages] = useState<string[]>(restaurant.images); // State to hold images
  const [newImages, setNewImages] = useState<File[]>([]); // State to hold newly selected images
  const [deletedImages, setDeletedImages] = useState<string[]>([]); // State to hold deleted image URLs



  useEffect(() => {
    setName(restaurant.name);
    setDescription(restaurant.description);
    setAddress(restaurant.address);
    setPhoneNumber(restaurant.phoneNumber);
    setOpeningHours(restaurant.openingHours);
    setStars(restaurant.stars);
    setImages(restaurant.images);
  }, [restaurant]);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('address', address);
    formData.append('phoneNumber', phoneNumber);
    formData.append('openingHours', openingHours);
    formData.append('stars', stars.toString());
    
    // Append existing images that are not deleted
    images.forEach(image => {
      if (!deletedImages.includes(image)) {
        formData.append('images', image);
      }
    });

    // Append newly selected images
    newImages.forEach(image => {
      formData.append('images', image);
    });

    try {
      const response = await fetch(`http://localhost:5002/restaurants/update/${restaurant._id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onSave(data);
      } else {
        const errorText = await response.text();
        console.error('Error updating restaurant:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error updating restaurant:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewImages(filesArray);
      
      // Display preview of newly selected images
      filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prevImages => [...prevImages, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDeleteImage = (imageUrl: string) => {
    // If image is from existing images, mark it for deletion
    if (images.includes(imageUrl)) {
      setDeletedImages(prevDeleted => [...prevDeleted, imageUrl]);
    }
    setImages(prevImages => prevImages.filter(image => image !== imageUrl));
  };

  return (
    <div className="edit-restaurant">
      <h2>Edit Restaurant</h2>
      <form>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Opening Hours:</label>
          <input type="text" value={openingHours} onChange={(e) => setOpeningHours(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Stars:</label>
          <input type="number" value={stars} onChange={(e) => setStars(Number(e.target.value))} />
        </div>
        <div className="form-group">
          <label>Images:</label>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} />
        </div>
        <br />
        <div className="image-preview">
          {images.map((imageUrl, index) => (
            <div key={index} className="image-item">
              <img src={`http://localhost:5002${imageUrl}`}  width={100} height={100} alt={`Image ${index}`} />
              <button type="button" onClick={() => handleDeleteImage(imageUrl)}>Delete</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={handleSave}>Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default EditRestaurant;
