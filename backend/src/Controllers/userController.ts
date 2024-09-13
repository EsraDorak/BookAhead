import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import { Request, Response } from "express";
import User from "../model/User";
import crypto from 'crypto';
import sendVerificationEmail from "../utils/sendVerificationMail";

// Funktion zum Erstellen eines JWT Tokens
const createToken = (_id: string): string => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY!;
  return jwt.sign({ _id }, jwtSecretKey, { expiresIn: "3d" });
};


// Controller-Funktion zum Registrieren eines neuen Benutzers
const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, lastName, email, password, confirmPassword } = req.body;

  try {
    // Überprüfen, ob der Benutzer bereits existiert
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json("User already exists...");
      return;
    }

     // Neuen Benutzer erstellen
     const newUser = new User({
      name,
      lastName,
      email,
      password,
      confirmPassword,
      emailToken: crypto.randomBytes(64).toString('hex'), // Initialisierung des emailTokens
    });

    // Validierung der Eingabefelder
    if (!name || !lastName || !email || !password) {
      res.status(400).json("All fields are required...");
      return;
    }

    if (!validator.isEmail(email)) {
      res.status(400).json("Email must be a valid email...");
      return;
    }

    if (!validator.isStrongPassword(password)) {
      res.status(400).json("Password must be a strong password..");
      return;
    }
    
    // Passwort verschlüsseln
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    // Benutzer in der Datenbank speichern
    await newUser.save();

    sendVerificationEmail(newUser);

    // JWT Token erstellen
    const token = createToken(newUser._id.toString());

    // Erfolgreiche Antwort mit Benutzerdaten und Token
    res.status(200).json({ _id: newUser._id.toString(), name, lastName, email, token, password, confirmPassword, date: newUser.date });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

// Controller-Funktion zum Einloggen eines Benutzers
const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password} = req.body;

  try {
    // Benutzer anhand der E-Mail-Adresse finden
    let user = await User.findOne({ email });

    // Fehlermeldung bei ungültigen Anmeldeinformationen
    if (!user) {
      res.status(400).json("Invalid email or password...");
      return;
    }

    // Passwort überprüfen
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(400).json("Invalid email or password...");
      return;
    }


    const token = createToken(user._id);

     // Setzen des JWT als Cookie im HTTP-Header der Antwort
     res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 Tage
      sameSite: 'strict',
    });

    // Erfolgreiche Antwort mit Benutzerdaten und Token
    res.status(200).json({ _id: user._id, name: user.name, email, token, date: user.date, lastName: user.lastName, isVerified: user.isVerified, });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

// Controller-Funktion zum Finden eines Benutzers anhand der ID
const findUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId;

  try {
    // Benutzer anhand der ID finden
    const user = await User.findById(userId);

    // Erfolgreiche Antwort mit Benutzerdaten
    res.status(200).json(user);
  } catch (error) {
    // Fehlerbehandlung bei Serverfehlern
    res.status(500).json(error);
  }
};

// Controller-Funktion zum Abrufen aller Benutzer
const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Alle Benutzer aus der Datenbank abrufen
    const users = await User.find();

    // Erfolgreiche Antwort mit Benutzerliste
    res.status(200).json(users);
  } catch (error) {
    // Fehlerbehandlung bei Serverfehlern
    res.status(500).json(error);
  }
};

// Controller-Funktion zur Verifizierung der E-Mail-Adresse eines Benutzers
const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { emailToken } = req.body;

    // Überprüfen, ob der emailToken vorhanden ist
    if (!emailToken) {
      return res.status(400).json("EmailToken not found...");
    }

    // Benutzer anhand des emailTokens finden
    const user = await User.findOne({ emailToken });

    // Verifizierung des Benutzers und Update der Datenbank
    if (user) {
      user.emailToken = null;
      user.isVerified = true;

      await user.save();

      // JWT Token erstellen
      const token = createToken(user._id);

      // Erfolgreiche Antwort mit Benutzerdaten, Token und Verifizierungsstatus
      res.status(200).json({
        _id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        token,
        date: user.date,
        isVerified: user?.isVerified,
      });
    } else {
      // Fehlermeldung bei ungültigem Token
      res.status(404).json('Email verification failed, invalid token!');
    }
  } catch (error) {
    // Fehlerbehandlung bei Serverfehlern
    console.error('Error verifying email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Export der Controller-Funktionen für die Verwendung in den Routen
export { registerUser, loginUser, findUser, getUsers, verifyEmail};