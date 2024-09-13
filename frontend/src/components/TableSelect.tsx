import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../TableSelect.css';
import PopUpselect from './PopUpselect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface Reservation {
  _id: string;
  user: string;
  reservationDate: string;
  reservationTime: string;
}

interface Table {
  _id: string;
  tableNumber: number;
  restaurantName: string;
  reservations: Reservation[];
}

const TableSelect: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const restaurantName = queryParams.get('restaurantName') || '';
  const user = location.state?.user?.name;

  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [reservationTime, setReservationTime] = useState<string>('');
  const [reservationDate, setReservationDate] = useState<string>('');
  const [popupMessage, setPopupMessage] = useState<string>('');
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [restaurantImages, setRestaurantImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedTableReservations, setSelectedTableReservations] = useState<Reservation[]>([]);
  const [expandedTableId, setExpandedTableId] = useState<string | null>(null);
  const [grundrissImageUrl, setGrundrissImageUrl] = useState<string>('');
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tableResponse, imageResponse] = await Promise.all([
          fetch(`http://localhost:5002/tables/getSelect?restaurantName=${encodeURIComponent(restaurantName)}`),
          fetch(`http://localhost:5002/addGrundriss/${restaurantName}`)
        ]);

        if (!tableResponse.ok) throw new Error('Error fetching tables');
        if (!imageResponse.ok) throw new Error('Error fetching restaurant images');

        const tableData = await tableResponse.json();
        const imageData = await imageResponse.json();

        setTables(tableData);
        setGrundrissImageUrl(imageData.imageUrl);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [restaurantName]);

  const handleTableClick = (table: Table) => {
    if (expandedTableId === table._id) {
      setExpandedTableId(null);
      setSelectedTable(null);
    } else {
      setExpandedTableId(table._id);
      setSelectedTable(table);
      setSelectedTableReservations(table.reservations);
      setReservationTime('');
      setReservationDate('');
    }
  };

  const handleConfirmReservation = async () => {
    if (!selectedTable) {
      setPopupMessage('Please select a table.');
      setShowPopup(true);
      return;
    }
    if (!reservationTime) {
      setPopupMessage('Please select a reservation time.');
      setShowPopup(true);
      return;
    }
    if (!reservationDate) {
      setPopupMessage('Please select a reservation date.');
      setShowPopup(true);
      return;
    }

    const existingReservation = selectedTable.reservations.find(
      (reservation) => reservation.reservationDate === reservationDate
    );

    if (existingReservation) {
      setPopupMessage('This table is already reserved on the selected date.');
      setShowPopup(true);
      return;
    }

    // Custom time validation for 13:00 to 23:59
    const selectedTime = new Date(`2000-01-01T${reservationTime}`);
    const minTime = new Date(`2000-01-01T11:00`);
    const maxTime = new Date(`2000-01-01T23:59`);

    if (!(selectedTime >= minTime && selectedTime <= maxTime)) {
      setPopupMessage('You can not make a reservation for this time.');
      setShowPopup(true);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5002/tables/reserve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableNumber: selectedTable.tableNumber,
          user: user,
          reservationTime,
          reservationDate,
          restaurantName,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      const updatedTables = tables.map((table) => {
        if (table._id === selectedTable._id) {
          return {
            ...table,
            reservations: [...table.reservations, { _id: 'newlyGeneratedId', user: user, reservationTime, reservationDate }],
          };
        }
        return table;
      });
      setTables(updatedTables);
      setSelectedTable(null);
      setReservationTime('');
      setReservationDate('');
      setPopupMessage('Table successfully reserved!');
      setShowPopup(true);
    } catch (error) {
      console.error('Error reserving table:', error);
      setPopupMessage('Failed to reserve table. Please try again.');
      setShowPopup(true);
    }
  };

  const handleFreeTable = async (reservation: Reservation) => {
    try {
      const response = await fetch(`http://localhost:5002/tables/free`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableId: selectedTable?._id,
          reservationId: reservation._id,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      const updatedTables = tables.map((table) => {
        if (table._id === selectedTable?._id) {
          return {
            ...table,
            reservations: table.reservations.filter((res) => res._id !== reservation._id),
          };
        }
        return table;
      });
      setTables(updatedTables);
      setSelectedTable((prevTable) => {
        if (prevTable) {
          return {
            ...prevTable,
            reservations: prevTable.reservations.filter((res) => res._id !== reservation._id),
          };
        }
        return prevTable;
      });
      setPopupMessage('Table successfully freed!');
      setShowPopup(true);
    } catch (error) {
      console.error('Error freeing table:', error);
      setPopupMessage('Failed to free table. Please try again.');
      setShowPopup(true);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${today.getFullYear()}-${month}-${day}`;
  };
  const handleBackClick = () => {
    navigate(-1); // Geht zur vorherigen Seite zurück
  };
  return (
    <div className="body-login">
      <div className="table-select-container">
      <button onClick={handleBackClick} className="back-button-2">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1>BookAhead</h1>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div className="table-grid">
              {grundrissImageUrl && (
                <div className="grundriss-container">
                  <img
                    id="grundriss"
                    src={`http://localhost:5002${grundrissImageUrl}`}
                    alt="Floor Plan"
                  />
                  <h4>Choose Your Table</h4>
                </div>
              )}
              
          <div className="sidebar">
              {tables.map((table) => (
                <div
                  key={table._id}
                  className={`table-item ${
                    expandedTableId === table._id ? "expanded" : ""
                  }`}
                  onClick={() => handleTableClick(table)}
                >
                  <div className="table-list">
                    <button>Table {table.tableNumber}</button>
                    {expandedTableId === table._id && (
                      <div>
                        {table.reservations.map((reservation, index) => (
                          <div key={index} className="reservation-info">
                            {reservation.user === user ? (
                              <>
                                {reservation.user} -{" "}
                                {reservation.reservationDate} -{" "}
                                {reservation.reservationTime}
                                <button
                                  onClick={() => handleFreeTable(reservation)}
                                >
                                  Free Table
                                </button>
                              </>
                            ) : (
                              <div>Blocked - {reservation.reservationDate}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              </div>
            </div>
            {selectedTable && (
              <div className="reservation-form">
                <h2>Reserve Table {selectedTable.tableNumber}</h2>
                <label>
                  Reservation Date:
                  <input
                    type="date"
                    value={reservationDate}
                    onChange={(e) => setReservationDate(e.target.value)}
                    min={getTodayDate()}
                    max="9999-12-31"
                    disabled={!selectedTable}
                  />
                </label>
                <label>
                  Reservation Time:
                  <input
                    type="time"
                    value={reservationTime}
                    onChange={(e) => setReservationTime(e.target.value)}
                  />
                </label>
                <button onClick={handleConfirmReservation}>
                  Confirm Reservation
                </button>
              </div>
            )}
            <PopUpselect
              message={popupMessage}
              show={showPopup}
              onClose={() => setShowPopup(false)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TableSelect;