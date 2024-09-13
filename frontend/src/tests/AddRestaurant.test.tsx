import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AddRestaurant from '../components/AddRestaurant';
import * as OwnerContext from '../components/OwnerContext'; // Import the actual OwnerContext module

// Mock the necessary modules
jest.mock('../components/OwnerContext', () => ({
  useOwner: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(), // Directly mock useNavigate
}));

describe('AddRestaurant Component', () => {
  beforeEach(() => {
    // Mock the useOwner hook to return a fake owner object
    (OwnerContext.useOwner as jest.Mock).mockReturnValue({
      owner: { id: '1', restaurantName: 'Test Restaurant' }, // Include all required fields
      setOwner: jest.fn(),
      logout: jest.fn(),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore all mocked functions after each test
  });

  test('renders AddRestaurant component', () => {
    render(
      <Router>
        <AddRestaurant />
      </Router>
    );
    expect(screen.getByText('Add New Restaurant')).toBeInTheDocument();
  });

  test('shows popup when required fields are missing', async () => {
    render(
      <Router>
        <AddRestaurant />
      </Router>
    );

    fireEvent.click(screen.getByText('Add Restaurant'));

    await waitFor(() =>
      expect(screen.getByText('Please fill in all required fields.')).toBeInTheDocument()
    );
  });

  test('uploads files and shows them in the selected list', async () => {
    render(
      <Router>
        <AddRestaurant />
      </Router>
    );

    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/Restaurant Bilder hochladen:/i);

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('example.png')).toBeInTheDocument();
    });
  });

  test('submits the form successfully', async () => {
    // Mock global fetch
    const fetchMock = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Restaurant added successfully!' }),
      })
    ) as jest.Mock;

    global.fetch = fetchMock;

    render(
      <Router>
        <AddRestaurant />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Test Restaurant' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByPlaceholderText('Opening Hours - Like 10:00 - 16:00'), { target: { value: '10:00 - 16:00' } });
    fireEvent.change(screen.getByPlaceholderText('Address'), { target: { value: '123 Test Street' } });
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '123456789' } });
    fireEvent.change(screen.getByPlaceholderText('Stars'), { target: { value: '4' } });

    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/Restaurant Bilder hochladen:/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByText('Add Restaurant'));

    await waitFor(() =>
      expect(screen.getByText('Restaurant added successfully!')).toBeInTheDocument()
    );

    // Clean up fetch mock
    fetchMock.mockRestore();
  });
});
