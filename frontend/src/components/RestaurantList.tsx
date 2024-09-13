import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../RestaurantList.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faClock, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';



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

const RestaurantItem: React.FC<{
  restaurant: Restaurant;
  isSelected: boolean;
  onClick: () => void;
}> = ({ restaurant, isSelected, onClick }) => (
  <div
    key={restaurant._id}
    className={`restaurant-item ${isSelected ? "" : ""}`}
    onClick={onClick}
  >
    <img
      src={`http://localhost:5002${restaurant.images[0]}`}
      alt={restaurant.name}
      className="restaurant-image"
    />
    <div className="restaurant-name">{restaurant.name}</div>
    <div className="restaurant-info-1">
                <p className="restaurant-address"><FontAwesomeIcon icon={faLocationDot} className="eye-icon-1"/>  
{restaurant.address}</p>
                <p className="restaurant-hours"><FontAwesomeIcon icon={faClock} className="eye-icon-1" />{restaurant.openingHours}</p>
              </div>

  </div>
);

const RestaurantList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<
    "name" | "stars" | "openingHours" | "none"
  >("none");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5002/restaurants/all`);
        if (response.ok) {
          const data: Restaurant[] = await response.json();
          setRestaurants(data);
        } else {
          console.error("Error fetching restaurants:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (option: "name" | "stars" | "openingHours" | "none") => {
    setSortOption(option);
  };

  const handleLogout = () => {
    localStorage.clear(); // Optional: Lokale Speicherdaten löschen oder andere Logout-Aktionen ausführen
    navigate("/loginU"); // Navigiere zur Login-Seite nach dem Logout
  };

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    const sortOptions: {
      [key in "name" | "stars" | "openingHours"]: (
        a: Restaurant,
        b: Restaurant
      ) => number;
    } = {
      name: (a, b) => a.name.localeCompare(b.name),
      stars: (a, b) => b.stars - a.stars,
      openingHours: (a, b) => a.openingHours.localeCompare(b.openingHours),
    };
    return sortOption !== "none" ? sortOptions[sortOption](a, b) : 0;
  });

  const filteredRestaurants = sortedRestaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant((prev) => (prev === restaurant ? null : restaurant));
  };

  useEffect(() => {
    if (!user) {
      const timeoutId = setTimeout(() => {
        navigate('/loginU'); // Redirect to login page after 5 seconds
      }, 5000);
      return () => clearTimeout(timeoutId); // Clear the timeout if component unmounts
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="body-login">
      <div className="please-login">
        <h1>Please Login</h1>
        <h1>You will be redirected to the login page shortly...</h1>
        <button  onClick={() => navigate('/loginU')} className="submit-table-list">
          Go to Login
        </button>
      </div>
      </div>
    );
  }
  return (
    <div className="body-restaurant-page">
    <div className="restaurant-list-container">
      <div className="restaurant-list-header">
        <h1>Restaurants</h1>
        <div className="search-sort">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="fa-magnifying-glass" />
          <input
            type="text"
            placeholder="Search for a restaurant..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <select
            onChange={(e) =>
              handleSort(
                e.target.value as "name" | "stars" | "openingHours" | "none"
              )
            }
          >
            <option value="none">No Filter</option>
            <option value="name">Sort Alphabetically</option>
            <option value="stars">Best Rating</option>
            <option value="openingHours">Longest Opening Hours</option>
          </select>
        </div>
        <div className="btn-restaurant-list">
          <button onClick={() => navigate("/profile", { state: { user } })}>
            {user?.name}
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>{" "}
          {/* Logout-Button */}
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="restaurant-list">
          {filteredRestaurants.length === 0 ? (
            <div>No restaurants found</div>
          ) : (
            filteredRestaurants.map((restaurant) => (
              <RestaurantItem
                key={restaurant._id}
                restaurant={restaurant}
                isSelected={selectedRestaurant === restaurant}
                onClick={() => handleRestaurantClick(restaurant)}
              />
            ))
          )}
        </div>
      )}
      {selectedRestaurant && (
        <div className="restaurant-details">
          <h2>{selectedRestaurant.name}</h2>
          <p>{selectedRestaurant.description}</p>
          <div className="image-gallery">
            {selectedRestaurant.images.map((imageUrl, index) => (
              <div key={index} className="image-item">
                <img
                  src={`http://localhost:5002${imageUrl}`}
                  alt={`Image ${index + 1}`}
                  width="350"
                  height="400"
                />
              </div>
            ))}
          </div>
          <h5>Menu</h5>

          <div className="menu-image-gallery">
            {selectedRestaurant.menuImages.map((menuImageUrl, index) => (
              <div key={index} className="image-item">
                <img src={`http://localhost:5002${menuImageUrl}`} alt={`Menu Image ${index + 1}`} id="menu-user" />
              </div>
            ))}
          </div>
          <p>
            <strong>Opening Hours:</strong> {selectedRestaurant.openingHours}
          </p>
          <p>
            <strong>Stars:</strong> {selectedRestaurant.stars}
          </p>
          <p>
            <strong>Phone Number:</strong> {selectedRestaurant.phoneNumber}
          </p>
          <button onClick={() => setSelectedRestaurant(null)}>Back</button>
          <Link
            to={`/table-User?restaurantName=${encodeURIComponent(
              selectedRestaurant.name
            )}&userName=${encodeURIComponent(user.name)}`}
            state={{ user }} // Pass the user object via state
          >
            <button>Show Tables</button>
          </Link>
        </div>
      )}
    </div>
    </div>
  );
};

export default RestaurantList;

