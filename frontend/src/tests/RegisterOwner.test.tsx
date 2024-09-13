import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { OwnerRegister } from "../components/RegisterOwner"; // Importiere das Registrierungsformular
import fetchMock from "jest-fetch-mock";

// Mock für den Navigations-Hook
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("RegisterOwner Component", () => {
  beforeEach(() => {
    fetchMock.enableMocks(); // Aktiviert das Mocken von fetch für jeden Test
    fetchMock.resetMocks();  // Setzt Mocking nach jedem Test zurück
  });

  test("should render the register form", () => {
    render(
      <Router>
        <OwnerRegister />
      </Router>
    );

    // Überprüfen, dass das Logo angezeigt wird
    expect(screen.getByAltText("Logo")).toBeInTheDocument();

    // Überprüfen, dass alle Eingabefelder vorhanden sind
    expect(screen.getByPlaceholderText("Restaurant Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Postal Code")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("City")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Phone Number")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();

    // Überprüfen, dass der "Submit"-Button vorhanden ist
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  test("should show error when fields are empty and submit is clicked", async () => {
    render(
      <Router>
        <OwnerRegister />
      </Router>
    );

    // Klicke auf den "Submit"-Button, ohne Daten einzugeben
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Warte auf das Erscheinen des Popups
    await waitFor(() => {
      expect(screen.getByText("All fields are required.")).toBeInTheDocument();
    });
  });

  test("should show error when passwords do not match", async () => {
    render(
      <Router>
        <OwnerRegister />
      </Router>
    );

   
    fireEvent.change(screen.getByPlaceholderText("Restaurant Name"), {
      target: { value: "Test Restaurant" },
    });
    fireEvent.change(screen.getByPlaceholderText("Address"), {
      target: { value: "123 Test Street" },
    });
    fireEvent.change(screen.getByPlaceholderText("Postal Code"), {
      target: { value: "12345" },
    });
    fireEvent.change(screen.getByPlaceholderText("City"), {
      target: { value: "Test City" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone Number"), {
      target: { value: "123456789" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "differentPassword" },
    });

    // Klicke auf den "Submit"-Button
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Warte auf das Erscheinen des Popups
    await waitFor(() => {
      expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
    });
  });

  test("should register successfully when all fields are valid", async () => {
    // Mocking der fetch-Funktion für die erfolgreiche Registrierung
    fetchMock.mockResponseOnce(
      JSON.stringify({ message: "Registration successful!" }),
      { status: 200 }
    );

    render(
      <Router>
        <OwnerRegister />
      </Router>
    );

    // Gib alle Felder korrekt ein
    fireEvent.change(screen.getByPlaceholderText("Restaurant Name"), {
      target: { value: "Test Restaurant" },
    });
    fireEvent.change(screen.getByPlaceholderText("Address"), {
      target: { value: "123 Test Street" },
    });
    fireEvent.change(screen.getByPlaceholderText("Postal Code"), {
      target: { value: "12345" },
    });
    fireEvent.change(screen.getByPlaceholderText("City"), {
      target: { value: "Test City" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone Number"), {
      target: { value: "123456789" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "password123" },
    });

    // Klicke auf den "Submit"-Button
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Warte auf das Erscheinen der Erfolgsnachricht
    await waitFor(() => {
      expect(
        screen.getByText("Registration successful!")
      ).toBeInTheDocument();
    });
  });

  test("should show error if email is already in use", async () => {
    // Mocking der fetch-Funktion für eine fehlerhafte Registrierung
    fetchMock.mockResponseOnce(
      JSON.stringify({ message: "Email already in use" }),
      { status: 400 }
    );

    render(
      <Router>
        <OwnerRegister />
      </Router>
    );

    // Gib alle Felder korrekt ein
    fireEvent.change(screen.getByPlaceholderText("Restaurant Name"), {
      target: { value: "Test Restaurant" },
    });
    fireEvent.change(screen.getByPlaceholderText("Address"), {
      target: { value: "123 Test Street" },
    });
    fireEvent.change(screen.getByPlaceholderText("Postal Code"), {
      target: { value: "12345" },
    });
    fireEvent.change(screen.getByPlaceholderText("City"), {
      target: { value: "Test City" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone Number"), {
      target: { value: "123456789" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "password123" },
    });

    // Klicke auf den "Submit"-Button
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Warte auf das Erscheinen der Fehlermeldung
    await waitFor(() => {
      expect(
        screen.getByText(
          "This email address is already registered. Please use a different email address."
        )
      ).toBeInTheDocument();
    });
  });
});
