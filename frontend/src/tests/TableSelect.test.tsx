import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import TableSelect from '../components/TableSelect'; // Pfad zur TableSelect Komponente

// Mocks
global.fetch = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: () => ({
    search: '?restaurantName=TestRestaurant',
    state: { user: { name: 'TestUser' } },
  }),
}));

describe('TableSelect Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display loading initially', () => {
    render(
      <Router>
        <TableSelect />
      </Router>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('should load and display tables after loading', async () => {
    const mockTables = [
      {
        _id: '1',
        tableNumber: 1,
        restaurantName: 'TestRestaurant',
        reservations: [],
      },
    ];

    const mockImages = { imageUrl: '/images/test-image.png' };

    // Mocking fetch responses
    (fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('getSelect')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTables),
        });
      } else if (url.includes('addGrundriss')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockImages),
        });
      }
      return Promise.reject(new Error('Invalid request'));
    });

    render(
      <Router>
        <TableSelect />
      </Router>
    );

    await waitFor(() => expect(screen.getByText(/Choose Your Table/i)).toBeInTheDocument());

    expect(screen.getByText('Table 1')).toBeInTheDocument();
    expect(screen.getByAltText(/Floor Plan/i)).toBeInTheDocument();
  });

  it('should allow selecting a table and showing reservation form', async () => {
    const mockTables = [
      {
        _id: '1',
        tableNumber: 1,
        restaurantName: 'TestRestaurant',
        reservations: [],
      },
    ];

    const mockImages = { imageUrl: '/images/test-image.png' };

    // Mocking fetch responses
    (fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('getSelect')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTables),
        });
      } else if (url.includes('addGrundriss')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockImages),
        });
      }
      return Promise.reject(new Error('Invalid request'));
    });

    render(
      <Router>
        <TableSelect />
      </Router>
    );

    await waitFor(() => expect(screen.getByText('Table 1')).toBeInTheDocument());

    // Click to expand table and show reservation form
    fireEvent.click(screen.getByText('Table 1'));

    await waitFor(() => expect(screen.getByText(/Reserve Table 1/i)).toBeInTheDocument());

    // Ensure reservation date and time inputs are available
    expect(screen.getByLabelText(/Reservation Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Reservation Time/i)).toBeInTheDocument();
  });

  it('should show error popup if trying to confirm reservation without time or date', async () => {
    const mockTables = [
      {
        _id: '1',
        tableNumber: 1,
        restaurantName: 'TestRestaurant',
        reservations: [],
      },
    ];

    const mockImages = { imageUrl: '/images/test-image.png' };

    // Mocking fetch responses
    (fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('getSelect')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTables),
        });
      } else if (url.includes('addGrundriss')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockImages),
        });
      }
      return Promise.reject(new Error('Invalid request'));
    });

    render(
      <Router>
        <TableSelect />
      </Router>
    );

    await waitFor(() => expect(screen.getByText('Table 1')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Table 1'));

    await waitFor(() => expect(screen.getByText(/Reserve Table 1/i)).toBeInTheDocument());

    // Confirm reservation without selecting date or time
    fireEvent.click(screen.getByText(/Confirm Reservation/i));

    // Expect error popup
    await waitFor(() => expect(screen.getByText(/Please select a reservation time/i)).toBeInTheDocument());
  });

  it('should show success message on successful reservation', async () => {
    const mockTables = [
      {
        _id: '1',
        tableNumber: 1,
        restaurantName: 'TestRestaurant',
        reservations: [],
      },
    ];

    const mockImages = { imageUrl: '/images/test-image.png' };

    // Mocking fetch responses
    (fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('getSelect')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTables),
        });
      } else if (url.includes('addGrundriss')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockImages),
        });
      } else if (url.includes('reserve')) {
        return Promise.resolve({
          ok: true,
        });
      }
      return Promise.reject(new Error('Invalid request'));
    });

    render(
      <Router>
        <TableSelect />
      </Router>
    );

    await waitFor(() => expect(screen.getByText('Table 1')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Table 1'));

    await waitFor(() => expect(screen.getByText(/Reserve Table 1/i)).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText(/Reservation Date/i), {
      target: { value: '2023-09-09' },
    });
    fireEvent.change(screen.getByLabelText(/Reservation Time/i), {
      target: { value: '12:00' },
    });

    fireEvent.click(screen.getByText(/Confirm Reservation/i));

    // Wait for success message
    await waitFor(() => expect(screen.getByText(/Table successfully reserved/i)).toBeInTheDocument());
  });

  it('should allow freeing a table reservation', async () => {
    const mockTables = [
      {
        _id: '1',
        tableNumber: 1,
        restaurantName: 'TestRestaurant',
        reservations: [
          {
            _id: 'reservation-1',
            user: 'TestUser',
            reservationDate: '2023-09-09',
            reservationTime: '12:00',
          },
        ],
      },
    ];

    const mockImages = { imageUrl: '/images/test-image.png' };

    // Mocking fetch responses
    (fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('getSelect')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTables),
        });
      } else if (url.includes('addGrundriss')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockImages),
        });
      } else if (url.includes('free')) {
        return Promise.resolve({
          ok: true,
        });
      }
      return Promise.reject(new Error('Invalid request'));
    });

    render(
      <Router>
        <TableSelect />
      </Router>
    );

    await waitFor(() => expect(screen.getByText('Table 1')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Table 1'));

    await waitFor(() => expect(screen.getByText(/Free Table/i)).toBeInTheDocument());

    fireEvent.click(screen.getByText(/Free Table/i));

    // Wait for success message
    await waitFor(() => expect(screen.getByText(/Table successfully freed/i)).toBeInTheDocument());
  });
});
