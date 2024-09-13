import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PopUp from '../components/PopUp';

describe('PopUp Component', () => {
  const message = 'This is a popup message';
  const onClose = jest.fn(); // Mock function to simulate onClose behavior

  test('renders the popup with the correct message', () => {
    render(<PopUp message={message} onClose={onClose} />);

    // Check if the message is displayed
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  test('calls onClose when the close button is clicked', () => {
    render(<PopUp message={message} onClose={onClose} />);

    // Simulate button click
    fireEvent.click(screen.getByText('Close'));

    // Check if onClose was called
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('renders the close button', () => {
    render(<PopUp message={message} onClose={onClose} />);

    // Check if the Close button is present
    const closeButton = screen.getByText('Close');
    expect(closeButton).toBeInTheDocument();
  });
});
