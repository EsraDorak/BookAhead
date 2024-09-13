import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format, startOfWeek, endOfWeek, addWeeks, parseISO } from 'date-fns';
import '../TableList.css';
import PopUp from './PopUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface Reservation {
  reservationDate: string;
  reservationTime?: string;
  guestName?: string;
  user: string;
}

interface Table {
  tableNumber: number;
  restaurantName: string;
  assignedUser?: string;
  blocked?: boolean;
  reservations: Reservation[];
}

const TableList: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const restaurantName = queryParams.get('restaurantName') || '';

  const [tables, setTables] = useState<Table[]>([]);
  const [filteredTables, setFilteredTables] = useState<Table[]>([]);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string>('');

  const [startDate, setStartDate] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [endDate, setEndDate] = useState<Date>(endOfWeek(new Date(), { weekStartsOn: 1 }));
  const [showAddTableForm, setShowAddTableForm] = useState(false);
  const [newTable, setNewTable] = useState({ tableNumber: '', restaurantName: restaurantName, reservations: [] });
  const navigate = useNavigate();


  const fetchAndFilterTables = async () => {
    try {
      const url = `http://localhost:5002/tables/getOwner?restaurantName=${encodeURIComponent(restaurantName)}`;
      const response = await fetch(url);
  
      if (response.ok) {
        const data = await response.json();
        setTables(data);
        setFilteredTables(filterAndSplitTables(data, startDate, endDate));
      } else {
        console.error('Error fetching tables:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const filterAndSplitTables = (tablesData: Table[], startDate: Date, endDate: Date): Table[] => {
    const filtered: Table[] = [];

    tablesData.forEach(table => {
      table.reservations.forEach(reservation => {
        const reservationDate = parseISO(reservation.reservationDate);
        if (reservationDate >= startDate && reservationDate <= endDate) {
          filtered.push({
            tableNumber: table.tableNumber,
            restaurantName: table.restaurantName,
            assignedUser: table.assignedUser,
            blocked: table.blocked,
            reservations: [reservation]
          });
        }
      });
    });

    return filtered;
  };

  const fetchImage = async () => {
    try {
      const response = await fetch(`http://localhost:5002/addGrundriss/${restaurantName}`);
      if (response.ok) {
        const data = await response.json();
        setUploadedImageUrl(data.imageUrl);
        setIsImageUploaded(true);
      } else {
        setIsImageUploaded(false);
      }
    } catch (error) {
      setIsImageUploaded(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleDeleteTable = async (tableNumber: number) => {
    try {
      const response = await fetch(`http://localhost:5002/tables/delete/${tableNumber}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPopupMessage('Table deleted successfully!');
        setShowPopup(true);
        const updatedTables = tables.filter(table => table.tableNumber !== tableNumber);
        setTables(updatedTables);
        setFilteredTables(filterAndSplitTables(updatedTables, startDate, endDate));
      } else {
        const errorData = await response.json();
        setPopupMessage(`Failed to delete table: ${errorData.message}`);
        setShowPopup(true);
      }
    } catch (error) {
      setPopupMessage('Failed to delete table. Please try again.');
      setShowPopup(true);
    }
  };

  const handleDeleteReservation = async (tableNumber: number, reservation: Reservation) => {
    try {
      const response = await fetch(`http://localhost:5002/tables/${tableNumber}/reservations`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reservationDate: reservation.reservationDate,
          reservationTime: reservation.reservationTime,
          user: reservation.user
        })
      });
  
      if (response.ok) {
        setPopupMessage('Reservation deleted successfully!');
        setShowPopup(true);
        const updatedTables = tables.map(table => {
          if (table.tableNumber === tableNumber) {
            const updatedReservations = table.reservations.filter(res => 
              !(res.reservationDate === reservation.reservationDate &&
                res.reservationTime === reservation.reservationTime &&
                res.user === reservation.user)
            );
            return {
              ...table,
              reservations: updatedReservations
            };
          }
          return table;
        });
        setTables(updatedTables);
        setFilteredTables(filterAndSplitTables(updatedTables, startDate, endDate));
      } else {
        const errorData = await response.json();
        setPopupMessage(`Failed to delete reservation: ${errorData.message}`);
        setShowPopup(true);
      }
    } catch (error) {
      setPopupMessage('Failed to delete reservation. Please try again.');
      setShowPopup(true);
    }
  };
  

  const handleAddTableClick = () => {
    setShowAddTableForm(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTable(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`http://localhost:5002/tables/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTable)
      });
  
      if (response.ok) {
        const data = await response.json();
        setTables(prevTables => [...prevTables, data]);
        setFilteredTables(filterAndSplitTables([...tables, data], startDate, endDate));
        setShowAddTableForm(false);
        setPopupMessage('Table added successfully!');
        setShowPopup(true);
      } else {
        const errorData = await response.json();
        setPopupMessage(`Failed to add table: ${errorData.message}`);
        setShowPopup(true);
      }
    } catch (error) {
      setPopupMessage('Error adding table. Please try again.');
      setShowPopup(true);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      setSelectedFileName(file.name);
      setUploadedImageUrl('');
      setIsImageUploaded(false);
    }
  };

  const handleImageUpload = async () => {
    if (!uploadedImage) {
      setPopupMessage('Please select an image to upload.');
      setShowPopup(true);
      return;
    }

    const formData = new FormData();
    formData.append('image', uploadedImage);
    formData.append('restaurantName', restaurantName);

    try {
      const response = await fetch(`http://localhost:5002/addGrundriss`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setUploadedImageUrl(`${data.imageUrl}?${new Date().getTime()}`);
        setUploadedImage(null);
        setIsImageUploaded(true);
        setSelectedFileName('');
        setPopupMessage('Image uploaded successfully!');
        setShowPopup(true);
      } else {
        setPopupMessage('Failed to upload image.');
        setShowPopup(true);
      }
    } catch (error) {
      setPopupMessage('Error uploading image.');
      setShowPopup(true);
    }
  };

  const handleImageDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5002/addGrundriss/${restaurantName}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setPopupMessage('Image deleted successfully');
        setShowPopup(true);
        setUploadedImageUrl('');
        setIsImageUploaded(false);
      } else {
        setPopupMessage('Failed to delete image');
        setShowPopup(true);
      }
    } catch (error) {
      setPopupMessage('Error deleting image');
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handlePreviousWeek = () => {
    setStartDate(addWeeks(startDate, -1));
    setEndDate(addWeeks(endDate, -1));
  };

  const handleNextWeek = () => {
    setStartDate(addWeeks(startDate, 1));
    setEndDate(addWeeks(endDate, 1));
  };

  useEffect(() => {
    if (restaurantName) {
      fetchAndFilterTables();
      fetchImage();
      const interval = setInterval(fetchAndFilterTables, 4000);
      return () => clearInterval(interval);
    }
  }, [restaurantName, startDate, endDate]);

  const handleBackClick = () => {
    navigate(-1); // Geht zur vorherigen Seite zurück
  };
 

  return (
    <div className="body-login">
      <div className="container-add-restaurant">
      <button onClick={handleBackClick} className="back-button-3">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1>Tables for {restaurantName}</h1>
  
        <div className="date-filter">
          <button className="submit-week" onClick={handlePreviousWeek}>Previous Week</button>
          <label>Week: {format(startDate, 'dd/MM/yyyy')} - {format(endDate, 'dd/MM/yyyy')}</label>
          <button className="submit-week" onClick={handleNextWeek}>Next Week</button>
        </div>
        <h4 id="list-h4">Reserved Tables</h4>

  
    <div className="bild-and-table">
        <div className="image-upload">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isImageUploaded}
          />
          <label>{selectedFileName}</label>
  
          {uploadedImageUrl && (
            <div className="uploaded-image-preview">
              <img
                src={`http://localhost:5002${uploadedImageUrl}`}
                alt={uploadedImage?.name}
                width="200"
                height="200"
              />
              <br />
              <button className="submit-table-list" onClick={handleImageDelete}>
                Delete Image
              </button>
            </div>
          )}
  
          {!isImageUploaded && (
            <div>
              <br />
              <button className="submit-table-list" onClick={handleImageUpload}>Upload Image</button>
            </div>
          )}
        </div>

        <div className="table-list1">
  
  {filteredTables.length === 0 ? (
    <p>No reserved tables for this week</p>
  ) : (
    
    filteredTables.map((table, index) => (
      <div key={index} className={`table-card1 ${table.blocked ? 'blocked' : 'free'}`}>
        <p>Table Number: {table.tableNumber}</p>
        {table.assignedUser && <p>Assigned User: {table.assignedUser}</p>}
        {table.reservations.length === 0 ? (
          <p>No Reservations</p>
        ) : (
          table.reservations.map((reservation, idx) => (
            <div key={`${table.tableNumber}-${idx}`} className="reservation-details">
              <p>Date: {format(parseISO(reservation.reservationDate), 'dd/MM/yyyy')}</p>
              {reservation.reservationTime && <p>Time: {reservation.reservationTime}</p>}
              {reservation.user && <p>Guest Name: {reservation.user}</p>}
              <button id="del-btn" onClick={() => handleDeleteReservation(table.tableNumber, reservation)}>
                Delete Reservation
              </button>
            </div>
          ))
        )}
      </div>
    ))
  )}
</div>

     
        </div>
        <button className="submit-table-list" onClick={handleAddTableClick}>Add Table</button>
  
        {showAddTableForm && (
          <form className='addTableForm' onSubmit={handleAddTable}>
            <label id='label1'>
              Table Number:       
              <input
                type="number"
                name="tableNumber"
                value={newTable.tableNumber}
                onChange={handleFormChange}
                required
              />
            </label>
            <button id="add-btn" type="submit">Add</button>
          </form>
        )}
  <div className="sidebar">
        
        <h4>All <br></br> Tables</h4>
            {tables.map((table, index) => (
              <li key={index}>
                {table.tableNumber}
                <button id = "del-btn" onClick={() => handleDeleteTable(table.tableNumber)}>Delete</button>
              </li>
            ))}
     
        </div>

  
        {showPopup && <PopUp message={popupMessage} onClose={closePopup} />}
      </div>
    </div>
  );
}

export default TableList;