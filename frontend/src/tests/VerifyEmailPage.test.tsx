import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContext } from '../components/UserContext';
import VerifyEmail from '../components/VerifyEmailPage';


// Mocking fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ isVerified: true }),
    })
) as jest.Mock;

// Mocking useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock functions and objects
const user = {
  email: 'test@example.com',
  isVerified: false,
  name: 'Jack',
  _id: '51436281',
  lastName: 'Johnson',
  emailToken: 'some-token', // Set a valid token for testing
  password: '6561661gh'
};
const updateUser = jest.fn();
const setUser = jest.fn();
const registerUser = jest.fn();
const updateRegisterInfo = jest.fn();
const loginUser = jest.fn();
const registerInfo = { name: 'John', lastName: 'Doe', email: 'john@example.com', password: 'password123' };
const loginInfo = { email: 'john@example.com', password: 'password123' };
const isLoginLoading = false;
const updateLoginInfo = jest.fn();
const loginError = null;
const registerError = null;
const isRegisterLoading = false;
const logoutUser = jest.fn();

describe('VerifyEmailPage Component', () => {
  it('shows circular progress while loading', async () => {
    render(
      <AuthContext.Provider value={{ user, updateUser, setUser, registerUser, updateRegisterInfo, loginUser, registerInfo, loginInfo, isLoginLoading, updateLoginInfo, loginError, registerError, isRegisterLoading, logoutUser }}>
        <Router>
          <VerifyEmail />
        </Router>
      </AuthContext.Provider>
    );

    // Check if the loading spinner is shown
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    // Wait for verification response
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
  });

  it('shows success message when verification is successful', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ isVerified: true }),
      })
    ) as jest.Mock;

    render(
      <AuthContext.Provider value={{ user, updateUser, setUser, registerUser, updateRegisterInfo, loginUser, registerInfo, loginInfo, isLoginLoading, updateLoginInfo, loginError, registerError, isRegisterLoading, logoutUser }}>
        <Router>
          <VerifyEmail />
        </Router>
      </AuthContext.Provider>
    );

    // Wait for success message to appear
    await waitFor(() => screen.getByText(/email verified/i));

    expect(screen.getByText(/email verified/i)).toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith('/restaurants-page');
  });

  it('shows error message when verification fails', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ error: true, message: 'Verification failed' }),
      })
    ) as jest.Mock;

    render(
      <AuthContext.Provider value={{ user, updateUser, setUser, registerUser, updateRegisterInfo, loginUser, registerInfo, loginInfo, isLoginLoading, updateLoginInfo, loginError, registerError, isRegisterLoading, logoutUser }}>
        <Router>
          <VerifyEmail />
        </Router>
      </AuthContext.Provider>
    );

    await waitFor(() => screen.getByText(/verification failed/i));
    expect(screen.getByText(/verification failed/i)).toBeInTheDocument();
  });

  it('displays user email and verification status', () => {
    const verifiedUser = { ...user, isVerified: true };

    render(
      <AuthContext.Provider value={{ user: verifiedUser, updateUser, setUser, registerUser, updateRegisterInfo, loginUser, registerInfo, loginInfo, isLoginLoading, updateLoginInfo, loginError, registerError, isRegisterLoading, logoutUser }}>
        <Router>
          <VerifyEmail />
        </Router>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/email: test@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/verified/i)).toBeInTheDocument();
  });
});
