import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOwner } from './OwnerContext';
import '../OwnerHomePage.css';
import PopUpDelete from './PopUpDeleteRe';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faLocationDot } from '@fortawesome/free-solid-svg-icons';

interface Restaurant {
  _id: string;
  name: string;
  description: string;
  address: string;
  phoneNumber: string;
  openingHours: string;
  stars: number;
  images: string[]; // Updated to handle multiple images
  menuImages: string[]; // Added to handle multiple menu images
}

const OwnerHomePage = () => {
  const { owner, logout } = useOwner();
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [restaurantToDelete, setRestaurantToDelete] = useState<string | null>(null);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
 

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!owner || !owner.restaurantName) {
        console.error('Owner information is missing or incomplete. Please log in again.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5002/restaurants/get?ownerName=${owner.restaurantName}`);
        if (response.ok) {
          const data = await response.json();
          setRestaurants(data);
        } else {
          console.error('Error fetching restaurants:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  }, [owner]);

  const handleLogout = () => {
    logout();
    navigate('/login-owner');
  };

  const handleRestaurantClick = (restaurant: Restaurant) => {
    if (selectedRestaurant && selectedRestaurant._id === restaurant._id) {
      setSelectedRestaurant(null);
    } else {
      setSelectedRestaurant(restaurant);
    }
  };

  const confirmDeleteRestaurant = (restaurantName: string) => {
    setPopupMessage('Are you sure you want to delete this restaurant? This action will also delete all associated tables.');
    setRestaurantToDelete(restaurantName);
    setShowPopup(true);
  };

  const handleDeleteRestaurant = async () => {
    if (!restaurantToDelete) return;

    try {
      const response = await fetch(`http://localhost:5002/restaurants/delete/${restaurantToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRestaurants(restaurants.filter((restaurant) => restaurant.name !== restaurantToDelete));
        setSelectedRestaurant(null);
        setShowPopup(false);
      } else {
        console.error('Error deleting restaurant:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting restaurant:', error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setRestaurantToDelete(null);
  };

  const handleEditRestaurant = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
  };

  const handleSaveRestaurant = (updatedRestaurant: Restaurant) => {
    setRestaurants((prevRestaurants) =>
      prevRestaurants.map((restaurant) =>
        restaurant._id === updatedRestaurant._id ? updatedRestaurant : restaurant
      )
    );
    setEditingRestaurant(null);
    setSelectedRestaurant(updatedRestaurant);
  };

  if (!owner) {
    return (
      <div className="body-login">
        <div className="please-login">
          <h1>Please Login</h1>
          <h1>You will be redirected to the login page shortly...</h1>
          <button onClick={() => navigate('/login-owner')} className="submit-table-list">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  
  return (
    <div className="owner-page-container">
      <div className="owner-page-header">
        <h1>Welcome, {owner.restaurantName}</h1>
        <div className="owner-page-actions">
          <Link to={`/add-restaurant?ownerName=${encodeURIComponent(owner.restaurantName)}`}>
            Add New Restaurant
          </Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <h2>Your Restaurants</h2>
      <div className="restaurant-list">
        {restaurants.length === 0 ? (
          <div>No restaurants found</div>
        ) : (
          restaurants.map(restaurant => (
            <div
              key={restaurant._id}
              className={`restaurant-card ${selectedRestaurant && selectedRestaurant._id !== restaurant._id ? "blur" : ""}`}
              onClick={() => handleRestaurantClick(restaurant)}
            >
              <div className="restaurant-header">
                <h4>{restaurant.name}</h4>
                {restaurant.images.length > 0 && (
                  <img
                    src={`http://localhost:5002${restaurant.images[0]}`}
                    alt={restaurant.name}
                    className="restaurant-img"
                  />
                )}
              </div>
              <div className="restaurant-info">
                <p className="restaurant-address">
                  <FontAwesomeIcon icon={faLocationDot} className="eye-icon-1" />
                  {restaurant.address}
                </p>
                <p className="restaurant-hours">
                  <FontAwesomeIcon icon={faClock} className="eye-icon-1" />
                  {restaurant.openingHours}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedRestaurant && !editingRestaurant && (
        <div className="restaurant-details">
          <h4>{selectedRestaurant.name}</h4>
          <p><strong>About Us:</strong> {selectedRestaurant.description}</p>
          <p><strong>Opening Hours:</strong> {selectedRestaurant.openingHours}</p>
          <div className="image-gallery">
            {selectedRestaurant.images.map((imageUrl, index) => (
              <div key={index} className="image-item">
                <img src={`http://localhost:5002${imageUrl}`} alt={`Image ${index + 1}`} className="restaurant-img-large" />
              </div>
            ))}
          </div>
          <strong>Menu Images</strong>
          <div className="menu-image-gallery">
            {selectedRestaurant.menuImages.map((menuImageUrl, index) => (
              <div key={index} className="image-item">
                <img src={`http://localhost:5002${menuImageUrl}`} alt={`Menu Image ${index + 1}`} className="restaurant-img-large" />
              </div>
            ))}
          </div>
          <p><strong>Address:</strong> {selectedRestaurant.address}</p>
          <p><strong>Stars:</strong> {selectedRestaurant.stars}</p>
          <p><strong>Phone:</strong> {selectedRestaurant.phoneNumber}</p>
        
          <button onClick={() => setSelectedRestaurant(null)}>Back</button>
          <Link to={`/tables?restaurantName=${encodeURIComponent(selectedRestaurant.name)}`}>
            <button>Show Tables</button>
          </Link>
          <button onClick={() => confirmDeleteRestaurant(selectedRestaurant.name)}>Delete Restaurant</button>
        </div>
      )}

      {showPopup && (
        <PopUpDelete
          message={popupMessage}
          onClose={closePopup}
          onConfirm={handleDeleteRestaurant}
        />
      )}
    </div>
  );
};

export default OwnerHomePage;
