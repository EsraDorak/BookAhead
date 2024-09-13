/*import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import { Request, Response } from "express";
import RestaurantOwner from "../model/Restaurant";
import crypto from 'crypto';

// Funktion zum Erstellen eines JWT Tokens
const createToken = (_id: string): string => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY_OWNER!;
  return jwt.sign({ _id }, jwtSecretKey, { expiresIn: "3d" });
};

// Controller-Funktion zum Registrieren eines neuen RestaurantOwners
const registerRestaurantOwner = async (req: Request, res: Response): Promise<void> => {
  const { restaurantName, address, postalCode, city, phoneNumber, email, password, confirmPassword } = req.body;

  try {
    // Überprüfen, ob der RestaurantOwner bereits existiert
    let owner = await RestaurantOwner.findOne({ email });
    if (owner) {
      res.status(400).json("Restaurant owner already exists...");
      return;
    }

    // Neuen RestaurantOwner erstellen
    const newOwner = new RestaurantOwner({
      restaurantName,
      address,
      postalCode,
      city,
      phoneNumber,
      email,
      password,
      confirmPassword,

    });

    // Validierung der Eingabefelder
    if (!restaurantName || !address || !postalCode || !city || !phoneNumber || !email || !password) {
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
    newOwner.password = await bcrypt.hash(newOwner.password, salt);

    // RestaurantOwner in der Datenbank speichern
    await newOwner.save();

    // JWT Token erstellen
    const token = createToken(newOwner._id.toString());

    // Erfolgreiche Antwort mit Benutzerdaten und Token
    res.status(200).json({ _id: newOwner._id.toString(), restaurantName, email, token, password, confirmPassword, date: newOwner.date, phoneNumber, postalCode, address, city  });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

// Controller-Funktion zum Einloggen eines RestaurantOwners
const loginRestaurantOwner = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // RestaurantOwner anhand der E-Mail-Adresse finden
    let owner = await RestaurantOwner.findOne({ email });

    // Fehlermeldung bei ungültigen Anmeldeinformationen
    if (!owner) {
      res.status(400).json("Invalid email or password...");
      return;
    }

    // Passwort überprüfen
    const validPassword = await bcrypt.compare(password, owner.password);
    if (!validPassword) {
      res.status(400).json("Invalid password...");
      return;
    }

    const token = createToken(owner._id);

    // Setzen des JWT als Cookie im HTTP-Header der Antwort
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 Tage
      sameSite: 'strict',
    });

    // Erfolgreiche Antwort mit Benutzerdaten und Token
    res.status(200).json({ _id: owner._id, restaurantName: owner.restaurantName, email, token, address: owner.address, postalCode: owner.postalCode, city: owner.city, phoneNumber: owner.phoneNumber, date: owner.date });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

// Controller-Funktion zum Finden eines RestaurantOwners anhand der ID
const findRestaurantOwner = async (req: Request, res: Response): Promise<void> => {
  const ownerId = req.params.ownerId;

  try {
    // RestaurantOwner anhand der ID finden
    const owner = await RestaurantOwner.findById(ownerId);

    // Erfolgreiche Antwort mit Benutzerdaten
    res.status(200).json(owner);
  } catch (error) {
    // Fehlerbehandlung bei Serverfehlern
    res.status(500).json(error);
  }
};

// Controller-Funktion zum Abrufen aller RestaurantOwners
const getRestaurantOwners = async (req: Request, res: Response): Promise<void> => {
  try {
    // Alle RestaurantOwners aus der Datenbank abrufen
    const owners = await RestaurantOwner.find();

    // Erfolgreiche Antwort mit Benutzerliste
    res.status(200).json(owners);
  } catch (error) {
    // Fehlerbehandlung bei Serverfehlern
    res.status(500).json(error);
  }
};


// Export der Controller-Funktionen für die Verwendung in den Routen
export { registerRestaurantOwner, loginRestaurantOwner, findRestaurantOwner, getRestaurantOwners };

*/