import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import OwnerHomePage from '../components/OwnerHomePage';

// Mocking Owner Context and fetch API
jest.mock('../components/OwnerContext', () => ({
  useOwner: jest.fn(),
}));

const mockOwner = {
  restaurantName: 'Test Owner',
};

const mockRestaurants = [
  {
    _id: '1',
    name: 'Test Restaurant',
    description: 'Test Description',
    address: '123 Test Street',
    phoneNumber: '123-456-7890',
    openingHours: '9am - 9pm',
    stars: 4,
    images: ['/images/test-restaurant.jpg'],
    menuImages: ['/images/menu-image1.jpg'],
  },
];

describe('OwnerHomePage Component', () => {
  beforeEach(() => {
    (require('../components/OwnerContext').useOwner as jest.Mock).mockReturnValue({
      owner: mockOwner,
      logout: jest.fn(),
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockRestaurants),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders OwnerHomePage and fetches restaurants', async () => {
    render(
      <Router>
        <OwnerHomePage />
      </Router>
    );

    // Checking if the page header contains the owner's name
    expect(screen.getByText(/Welcome, Test Owner/i)).toBeInTheDocument();

    // Waiting for restaurants to be loaded
    await waitFor(() => {
      expect(screen.getByText(/Test Restaurant/i)).toBeInTheDocument();
    });
  });

  test('shows restaurant details when a restaurant is clicked', async () => {
    render(
      <Router>
        <OwnerHomePage />
      </Router>
    );

    // Wait for restaurants to load
    await waitFor(() => screen.getByText(/Test Restaurant/i));

    // Click on the restaurant to view details
    fireEvent.click(screen.getByText(/Test Restaurant/i));

    // Checking for restaurant details
    expect(screen.getByText(/About Us:/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Description/i)).toBeInTheDocument();
    expect(screen.getAllByText(/123 Test Street/i)[0]).toBeInTheDocument();
  });

  test('shows delete confirmation popup when delete is clicked', async () => {
    render(
      <Router>
        <OwnerHomePage />
      </Router>
    );

    // Wait for restaurants to load
    await waitFor(() => screen.getByText(/Test Restaurant/i));

    // Click on the restaurant to view details
    fireEvent.click(screen.getByText(/Test Restaurant/i));

    // Click the delete button
    fireEvent.click(screen.getByText(/Delete Restaurant/i));

    // The delete confirmation popup should be displayed
    expect(screen.getByText(/Are you sure you want to delete this restaurant?/i)).toBeInTheDocument();
  });

  test('deletes restaurant on confirmation', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRestaurants),
      })
      .mockResolvedValueOnce({ ok: true });

    render(
      <Router>
        <OwnerHomePage />
      </Router>
    );

    // Wait for restaurants to load
    await waitFor(() => screen.getByText(/Test Restaurant/i));

    // Click on the restaurant to view details
    fireEvent.click(screen.getByText(/Test Restaurant/i));

    // Click the delete button
    fireEvent.click(screen.getByText(/Delete Restaurant/i));

    // Confirm deletion
    fireEvent.click(screen.getByText(/Confirm/i));

    // Wait for deletion to complete and the restaurant list to update
    await waitFor(() => {
      expect(screen.queryByText(/Test Restaurant/i)).not.toBeInTheDocument();
    });
  });
});
