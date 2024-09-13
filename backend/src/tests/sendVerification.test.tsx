import sendVerificationEmail from '../utils/sendVerificationMail'; 
import createMailTransporter from '../utils/createMailTransporter'; 
import { IUser } from '../model/User';

// Mock the createMailTransporter function
jest.mock('../utils/createMailTransporter', () => jest.fn());

describe('sendVerificationEmail', () => {
  const mockSendMail = jest.fn();

  // Mock user with necessary fields
  const mockUser: Partial<IUser> = {
    email: 'testuser@example.com',
    name: 'Test User',
    emailToken: 'test-token', // Example token for testing
    // Add other necessary fields from IUser if needed for your tests
  };

  beforeEach(() => {
    // Reset mock functions before each test
    jest.clearAllMocks();

    // Mock the createMailTransporter to return an object with a sendMail method
    (createMailTransporter as jest.Mock).mockReturnValue({
      sendMail: mockSendMail,
    });
  });

  test('should send verification email with correct options', () => {
    sendVerificationEmail(mockUser as IUser);

    // Verify that sendMail was called
    expect(mockSendMail).toHaveBeenCalledTimes(1);

    // Extract the email options from the sendMail call
    const mailOptions = mockSendMail.mock.calls[0][0];

    // Check if the email was sent to the correct recipient
    expect(mailOptions.to).toBe(mockUser.email);
    
    // Verify the subject and HTML content
    expect(mailOptions.subject).toBe('Please verify your email address');
    expect(mailOptions.html).toContain(`Hello ${mockUser.name}`);
    expect(mailOptions.html).toContain(`http://localhost:3000/verify-email/${mockUser.emailToken}`);
  });

  test('should log error if sendMail fails', () => {
    // Simulate sendMail error
    mockSendMail.mockImplementationOnce((options, callback) => {
      callback(new Error('Failed to send email'));
    });

    // Spy on console.log to capture the log output
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    sendVerificationEmail(mockUser as IUser);

    // Check that console.log was called with the error message
    expect(consoleSpy).toHaveBeenCalledWith(new Error('Failed to send email'));

    consoleSpy.mockRestore(); // Restore console.log to its original state
  });

  test('should log success message when email is sent', () => {
    // Simulate successful sendMail
    mockSendMail.mockImplementationOnce((options, callback) => {
      callback(null);
    });

    // Spy on console.log
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    sendVerificationEmail(mockUser as IUser);

    // Check if the success message was logged
    expect(consoleSpy).toHaveBeenCalledWith('Verification email sent');

    consoleSpy.mockRestore(); // Restore console.log
  });
});
