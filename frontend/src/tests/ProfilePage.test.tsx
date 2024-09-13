import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ProfilePage from '../components/ProfilePage';
import { useLocation } from 'react-router-dom';

// Mocking useLocation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

// Mocking the `fetch` API
global.fetch = jest.fn();

const mockUser = {
  id: 1,
  name: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  date: '2021-08-19T18:25:43.511Z',
};

describe('ProfilePage Component', () => {
  beforeEach(() => {
    // Clear the mock fetch and location before each test
    (fetch as jest.Mock).mockClear();

    // Mock the return value of useLocation
    (useLocation as jest.Mock).mockReturnValue({
      state: {
        user: mockUser,
      },
    });
  });

  it('should render the profile information', () => {
    render(
      <Router>
        <ProfilePage />
      </Router>
    );

    expect(screen.getAllByText(/John/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/2021-08-19/i)).toBeInTheDocument();
  });

  it('should toggle the edit form when edit button is clicked', () => {
    render(
      <Router>
        <ProfilePage />
      </Router>
    );

    fireEvent.click(screen.getByText(/Edit/i));

    // Ensure the edit form appears
    expect(screen.getByDisplayValue(/John/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Doe/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/New Password/i)).toBeInTheDocument();
  });

  it('should show validation error if password is not provided when saving', async () => {
    render(
      <Router>
        <ProfilePage />
      </Router>
    );

    fireEvent.click(screen.getByText(/Edit/i));
    fireEvent.click(screen.getByText(/Save/i));

    await waitFor(() => {
      expect(screen.getByText(/Please provide your password/i)).toBeInTheDocument();
    });
  });

  it('should successfully update profile with correct data', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { ...mockUser, name: 'Jane', lastName: 'Doe' } }),
    });
  
    render(
      <Router>
        <ProfilePage />
      </Router>
    );
  
    // Klicken Sie auf den Bearbeitungs-Button, um das Formular anzuzeigen
    fireEvent.click(screen.getByText(/Edit/i));
  
    // Überprüfen Sie, ob das "New Password"-Feld vorhanden ist
    const newPasswordField = screen.getByPlaceholderText(/New Password/i);
    expect(newPasswordField).toBeInTheDocument();
  
    // Ändern Sie die Werte im Formular
    fireEvent.change(screen.getByDisplayValue(/John/i), { target: { value: 'Jane' } });
    fireEvent.change(newPasswordField, { target: { value: 'Password123' } });
    fireEvent.click(screen.getByText(/Save/i));
  
    // Überprüfen Sie die erfolgreiche Aktualisierung
    await waitFor(() => {
      expect(screen.getByText(/Profile updated successfully/i)).toBeInTheDocument();
      expect(screen.getByText(/Jane/i)).toBeInTheDocument();
    });
  });
  

  it('should handle profile deletion', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
    });

    render(
      <Router>
        <ProfilePage />
      </Router>
    );

    fireEvent.click(screen.getByText(/Edit/i));
    fireEvent.click(screen.getByText(/Delete Profile/i));

    await waitFor(() => {
      expect(screen.getByText(/Profile deleted successfully/i)).toBeInTheDocument();
    });
  });
});
