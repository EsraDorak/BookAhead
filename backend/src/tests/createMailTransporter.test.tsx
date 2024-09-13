import nodemailer from 'nodemailer';
import createMailTransporter from '../utils/createMailTransporter'; // Pfad anpassen

// Mocking von nodemailer
jest.mock('nodemailer');

describe('Mailer Transporter', () => {
  it('should create a mail transporter with correct configuration', () => {
    // Mocking der Rückgabe von createTransport
    const mockTransporter = {
      sendMail: jest.fn(),
    };
    
    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

    const transporter = createMailTransporter();

    // Überprüfe, ob nodemailer.createTransport mit der richtigen Konfiguration aufgerufen wurde
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.PASSWORD_USER,
      },
    });

    // Überprüfe, ob der zurückgegebene Transporter der erwartete mockTransporter ist
    expect(transporter).toBe(mockTransporter);
  });
});
