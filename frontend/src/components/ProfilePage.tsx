import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../ProfilePage.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function ProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");
  const [editedLastName, setEditedLastName] = useState(user?.lastName || "");
  const [editedPassword, setEditedPassword] = useState("");
  const [currentUser, setCurrentUser] = useState(user);
  const [message, setMessage] = useState("");



  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (editedPassword === "") {
      setMessage("Please provide your password to save changes.");
      return;
    }

    const updatedUser = {
      id: user.id,
      name: editedName,
      lastName: editedLastName,
      email: user.email,
      password: editedPassword,
    };
    const response = await fetch(`http://localhost:5002/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    });

    if (response.ok) {
      const data = await response.json();
      setIsEditing(false);
      setMessage("Profile updated successfully");
      setCurrentUser(data.user);

      setTimeout(() => {
        window.location.href = "/loginU";
      }, 1000);
    } else {
      const errorData = await response.json();
      setMessage(errorData.message || "Failed to update profile");
    }
  };

  const handleDeleteProfile = async () => {
    const response = await fetch(`http://localhost:5002/update/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: user.email }),
    });

    if (response.ok) {
      setMessage("Profile deleted successfully");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } else {
      const errorData = await response.json();
      setMessage(errorData.message || "Failed to delete profile");
    }
  };

  const handleShowBlockedTables = () => {
    navigate("/blocked-tables", { state: { user } });
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  

  const handleBackClick = () => {
    navigate(-1); // Geht zur vorherigen Seite zurück
  };

  return (
    <div className="body-login">
      <div className="profile-card">
        <div className="profile-header">
        <button onClick={handleBackClick} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1>User Profile</h1>
        </div>
        {currentUser ? (
          <div className="edit-form">
            <p>
              <strong>Name:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="input-edit"
                />
              ) : (
                <span>{currentUser.name}</span>
              )}
            </p>
            <p>
              <strong>Last Name:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  value={editedLastName}
                  onChange={(e) => setEditedLastName(e.target.value)}
                  className="input-edit"
                />
              ) : (
                <span>{currentUser.lastName}</span>
              )}
            </p>
            <p>
              <strong>Email:</strong> <span>{currentUser.email}</span>
            </p>
            <p>
              <strong>Joined Date:</strong>{" "}
              <span>{formatDate(currentUser.date)}</span>
            </p>
            {isEditing && (
              <p>
                <strong>New Password:</strong>{" "}
                <input
                  type="password"
                   placeholder="New Password"
                  value={editedPassword}
                  onChange={(e) => setEditedPassword(e.target.value)}
                  className="input-edit"
                />
              </p>
            )}
            {isEditing ? (
              <div className="profile-btn">
                <button onClick={handleSaveClick} className="save-btn">
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <br />
                <button onClick={handleDeleteProfile} className="delete-btn">
                  Delete Profile
                </button>
              </div>
            ) : (
              <div className="profile-btn">
                <button onClick={handleEditClick} className="edit-btn">
                  Edit
                </button>
                <button onClick={handleShowBlockedTables} className="table-btn">
                  My Tables
                </button>
              </div>
            )}
            {message && <p className="message">{message}</p>}
          </div>
        ) : (
          <p>No user data available.</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;


