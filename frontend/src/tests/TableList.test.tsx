/*import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import TableList from '../components/TableList';
import { format, startOfWeek, endOfWeek } from 'date-fns';

// Mock fetch API
global.fetch = jest.fn() as jest.Mock;

// Mocking URLSearchParams to control query params
const mockLocation = { search: '?restaurantName=TestRestaurant' };

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => mockLocation,
  useNavigate: () => mockNavigate,
}));

describe('TableList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing and displays correct restaurant name', () => {
    render(
      <Router>
        <TableList />
      </Router>
    );
    expect(screen.getByText('Tables for TestRestaurant')).toBeInTheDocument();
  });

  it('fetches and displays tables', async () => {
    const tablesData = [
      {
        tableNumber: 1,
        restaurantName: 'TestRestaurant',
        assignedUser: 'John Doe',
        blocked: false,
        reservations: []
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(tablesData)
    });

    render(
      <Router>
        <TableList />
      </Router>
    );

    await waitFor(() => screen.getByText('Table Number: 1'));

    expect(screen.getByText('Table Number: 1')).toBeInTheDocument();
  });

  it('adds a new table', async () => {
    const tablesData = [
      {
        tableNumber: 1,
        restaurantName: 'TestRestaurant',
        assignedUser: 'John Doe',
        blocked: false,
        reservations: []
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ tableNumber: 2, restaurantName: 'TestRestaurant', assignedUser: '', blocked: false, reservations: [] })
    });

    render(
      <Router>
        <TableList />
      </Router>
    );

    // Open add table form
    fireEvent.click(screen.getByText('Add Table'));

    // Fill out and submit form
    fireEvent.change(screen.getByLabelText('Table Number:'), { target: { value: '2' } });
    fireEvent.click(screen.getByText('Add'));

    await waitFor(() => screen.getByText('Table Number: 2'));

    expect(screen.getByText('Table Number: 2')).toBeInTheDocument();
  });

  it('deletes a table', async () => {
    const tablesData = [
      {
        tableNumber: 1,
        restaurantName: 'TestRestaurant',
        assignedUser: 'John Doe',
        blocked: false,
        reservations: []
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Table deleted successfully!' })
    });

    render(
      <Router>
        <TableList />
      </Router>
    );

    // Trigger delete
    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => expect(screen.queryByText('Table Number: 1')).not.toBeInTheDocument());
  });

  it('uploads an image', async () => {
    const imageUrl = '/path/to/image.jpg';

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ imageUrl })
    });

    render(
      <Router>
        <TableList />
      </Router>
    );

    // Select and upload image
    fireEvent.change(screen.getByLabelText(''), { target: { files: [new File([], 'test-image.jpg')] } });
    fireEvent.click(screen.getByText('Upload Image'));

    await waitFor(() => screen.getByAltText('test-image.jpg'));

    expect(screen.getByAltText('test-image.jpg')).toBeInTheDocument();
  });

  it('deletes an uploaded image', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve()
    });

    render(
      <Router>
        <TableList />
      </Router>
    );

    // Upload an image first
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ imageUrl: '/path/to/image.jpg' })
    });

    fireEvent.change(screen.getByLabelText(''), { target: { files: [new File([], 'test-image.jpg')] } });
    fireEvent.click(screen.getByText('Upload Image'));

    await waitFor(() => screen.getByAltText('test-image.jpg'));

    // Now delete the image
    fireEvent.click(screen.getByText('Delete Image'));

    await waitFor(() => expect(screen.queryByAltText('test-image.jpg')).not.toBeInTheDocument());
  });

  it('navigates back to the previous page', () => {
    render(
      <Router>
        <TableList />
      </Router>
    );

    fireEvent.click(screen.getByRole('button', { name: /back/i }));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
*/