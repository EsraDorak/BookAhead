import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import BlockedTables from '../components/BlockedTables';

// Mocking useLocation to simulate different states
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('BlockedTables Component', () => {
  const mockedNavigate = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    (useLocation as jest.Mock).mockReturnValue({
      state: {
        user: { name: 'Test User' },
      },
    });

    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockedNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  test('renders BlockedTables component', () => {
    render(
      <Router>
        <BlockedTables />
      </Router>
    );

    expect(screen.getByText('Your Tables')).toBeInTheDocument();
  });

  test('displays no reservations message when there are no blocked tables', async () => {
    // Mock global fetch to return an empty array
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    ) as jest.Mock;

    render(
      <Router>
        <BlockedTables />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('No reservations')).toBeInTheDocument();
    });
  });

  test('handles fetch error gracefully', async () => {
    // Mock global fetch to simulate an error
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Network response was not ok'))
    ) as jest.Mock;

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <Router>
        <BlockedTables />
      </Router>
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching blocked tables:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

});