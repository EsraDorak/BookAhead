import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../style_HomePage.css';
import Header from './Header';

const HomePage = () => {
  const taglines = [
    "NO MORE WAITING - BOOK A TABLE AND ENJOY YOUR MEAL RIGHT AWAY!",
    "EXPERIENCE FINE DINING AT TOP RESTAURANTS - BOOK YOUR TABLE TODAY!",
    "EASY RESERVATIONS, DELIGHTFUL DINING!",
    "YOUR PERFECT DINING EXPERIENCE AWAITS!",
  ];

  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  const location = useLocation();
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTaglineIndex((prevIndex) => (prevIndex + 1) % taglines.length);
    }, 4000); // Match the CSS animation duration

    return () => clearInterval(interval); // Clear the interval on component unmount
  }, [taglines.length]);

  useEffect(() => {
    if (location.state?.message) {
      setNotification(location.state.message);
      setTimeout(() => setNotification(null), 5000); // Hide the notification after 5 seconds
    }
  }, [location.state]);

  return (
    <div className="container-homepage">
      <header className="header">
        <Header />
      </header>
      <div className="background-image">
        <div className="overlay">
          <h1 className="tagline">{taglines[currentTaglineIndex]}</h1>
          {notification && <div className="notification">{notification}</div>}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
