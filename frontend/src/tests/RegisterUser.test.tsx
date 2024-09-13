import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Register from '../components/RegisterUser'; // Assuming the file is named Register.tsx

// Mock fetch
global.fetch = jest.fn();

describe('Register Component', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    (fetch as jest.Mock).mockClear();
  });

  it('should render the register form', () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    // Verwende eine genauere Methode, um die Eingabefelder zu finden
    expect(screen.getAllByPlaceholderText(/Name/i)[0]).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(/Last Name/i)[0]).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(/Password/i)[0]).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
  });

  it('should show validation error for empty fields', async () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(screen.getByText(/All fields are required/i)).toBeInTheDocument();
    });
  });

  it('should show error for weak password', async () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    fireEvent.change(screen.getAllByPlaceholderText(/Name/i)[0], { target: { value: 'John' } });
    fireEvent.change(screen.getAllByPlaceholderText(/Last Name/i)[0], { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getAllByPlaceholderText(/Password/i)[0], { target: { value: '123' } });
    fireEvent.change(screen.getAllByPlaceholderText(/Confirm Password/i)[0], { target: { value: '123' } });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(screen.getByText(/Password must be a strong password/i)).toBeInTheDocument();
    });
  });

  it('should show error for non-matching passwords', async () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    fireEvent.change(screen.getAllByPlaceholderText(/Name/i)[0], { target: { value: 'John' } });
    fireEvent.change(screen.getAllByPlaceholderText(/Last Name/i)[0], { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getAllByPlaceholderText(/Password/i)[0], { target: { value: 'StrongPassword123!' } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: 'DifferentPassword' } });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('should handle registration success', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Registration successful!' }),
    });

    render(
      <Router>
        <Register />
      </Router>
    );

    fireEvent.change(screen.getAllByPlaceholderText(/Name/i)[0], { target: { value: 'John' } });
    fireEvent.change(screen.getAllByPlaceholderText(/Last Name/i)[0], { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getAllByPlaceholderText(/Password/i)[0], { target: { value: 'StrongPassword123!' } });
    fireEvent.change(screen.getAllByPlaceholderText(/Confirm Password/i)[0], { target: { value: 'StrongPassword123!' } });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(screen.getByText(/Registration successful/i)).toBeInTheDocument();
    });
  });

  it('should show error when email is already registered', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Email already in use' }),
    });

    render(
      <Router>
        <Register />
      </Router>
    );

    fireEvent.change(screen.getAllByPlaceholderText(/Name/i)[0], { target: { value: 'John' } });
    fireEvent.change(screen.getAllByPlaceholderText(/Last Name/i)[0], { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getAllByPlaceholderText(/Password/i)[0], { target: { value: 'StrongPassword123!' } });
    fireEvent.change(screen.getAllByPlaceholderText(/Confirm Password/i)[0], { target: { value: 'StrongPassword123!' } });

    fireEvent.click(screen.getByText(/Submit/i));

  });
});
