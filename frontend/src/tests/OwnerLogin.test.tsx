import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { OwnerLogin } from "../components/OwnerLogin";
import { useNavigate } from "react-router-dom";
import { useOwner } from "../components/OwnerContext";

// Mocking useNavigate and useOwner
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../components/OwnerContext", () => ({
  useOwner: jest.fn(),
}));

describe("OwnerLogin Component", () => {
  const mockNavigate = jest.fn();
  const mockSetOwner = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useOwner as jest.Mock).mockReturnValue({ setOwner: mockSetOwner });
    jest.clearAllMocks();
  });

  it("renders login form correctly", () => {
    render(
      <Router>
        <OwnerLogin />
      </Router>
    );

    // Check if all necessary fields are rendered
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument(); // Assuming LoginShowPassword component has placeholder for password
    expect(screen.getByText(/Log In/i)).toBeInTheDocument();
  });

  it("shows error message on failed login", async () => {
    // Mocking a failed login response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: async () => ({ message: "Login failed" }),
      })
    ) as jest.Mock;

    render(
      <Router>
        <OwnerLogin />
      </Router>
    );

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByText("Login"));

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Login failed/i)).toBeInTheDocument();
    });
  });

  it("redirects to owner-homepage on successful login", async () => {
    // Mocking a successful login response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({ id: 1, name: "Restaurant Name" }),
      })
    ) as jest.Mock;

    render(
      <Router>
        <OwnerLogin />
      </Router>
    );

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "correctpassword" },
    });

    fireEvent.click(screen.getByText("Login"));

    // Wait for the success message
    await waitFor(() => {
      expect(screen.getByText(/Welcome Restaurant Name/i)).toBeInTheDocument();
    });


  it("handles unexpected errors during login", async () => {
    // Mocking a failed login response with a network error
    global.fetch = jest.fn(() => Promise.reject(new Error("Network Error"))) as jest.Mock;

    render(
      <Router>
        <OwnerLogin />
      </Router>
    );

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByText("Login"));

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/An unexpected error occurred/i)).toBeInTheDocument();
    });
  });
});
});