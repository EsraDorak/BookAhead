import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../BlockedTables.css';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const BlockedTables: React.FC = () => {
  const location = useLocation();
  const user = location.state?.user;
  const [blockedTables, setBlockedTables] = useState<any[]>([]);
  const navigate = useNavigate();


  useEffect(() => {
    if (user) {
      fetchBlockedTables();
    }
  }, [user]);

  const fetchBlockedTables = async () => {
    try {
      const response = await fetch(`http://localhost:5002/tables/blocked-tables?userName=${encodeURIComponent(user.name)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setBlockedTables(data);
    } catch (error) {
      console.error('Error fetching blocked tables:', error);
    }
  };

  const handleBackClick = () => {
    navigate(-1); // Geht zur vorherigen Seite zurück
  };

  return (
    <div className="body-login">
      <div className="blocked-tables-container">
        <h1>Your Tables</h1>
        <div className="table-info">
        <button onClick={handleBackClick} className="back-button-1">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
          {blockedTables.length > 0 ? (
            blockedTables.map((table) => (
              <div key={table._id} className="table-info-item">
                <p><strong>Restaurant:</strong> {table.restaurantName}</p>
                <p><strong>Table Nr.:</strong> {table.tableNumber}</p>
                {table.reservations
                  .filter((reservation: { user: any; }) => reservation.user === user.name)
                  .map((reservation: { _id: React.Key | null | undefined; reservationDate: string | number | Date; reservationTime: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
                    <div key={reservation._id} className="reservation-info">
                      <p>
                      <strong>Date:</strong>{" "}
                        {format(
                          new Date(reservation.reservationDate),
                          "dd/MM/yyyy"
                        )}
                      </p>
                      <p><strong>Time:</strong> {reservation.reservationTime}</p>
                    </div>
                  ))}
              </div>
            ))
          ) : (
            <p>No reservations</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockedTables;
