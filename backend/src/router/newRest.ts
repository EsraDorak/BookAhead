import path from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import NewRestaurant from '../model/newRestaurant';
import Table from '../model/Table';
import express, { Request, Response } from 'express';

const NewResrouter = express.Router();
NewResrouter.use(bodyParser.json({ limit: '50mb' }));
NewResrouter.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
NewResrouter.use(cors());

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage: storage });

// Interface for defining the request body structure
interface RestaurantRequest {
  name: string;
  description: string;
  openingHours: string;
  stars: number;
  address: string;
  phoneNumber: string;
  ownerName: string;
}

// Route for adding a new restaurant with image upload
NewResrouter.post('/add', upload.fields([{ name: 'images', maxCount: 10 }, { name: 'menuImages', maxCount: 10 }]), async (req, res) => {
  try {
    const { name, description, openingHours, stars, address, phoneNumber, ownerName }: RestaurantRequest = req.body;

    // Ensure all required fields are present
    if (!name || !description || !req.files || !openingHours || stars === 0 || !address || !phoneNumber || !ownerName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Map uploaded files to image URLs
    const images = (req.files as { [fieldname: string]: Express.Multer.File[] }).images.map(file => ({
      imageUrl: `/uploads/${file.filename}`
    }));

    const menuImages = (req.files as { [fieldname: string]: Express.Multer.File[] }).menuImages.map(file => ({
      imageUrl: `/uploads/${file.filename}`
    }));

    // Save restaurant data along with image paths
    const restaurant = new NewRestaurant({
      name,
      description,
      images: images.map(img => img.imageUrl), // Save only the URLs
      menuImages: menuImages.map(img => img.imageUrl), // Save only the URLs
      openingHours,
      stars,
      address,
      phoneNumber,
      ownerName
    });

    await restaurant.save();
    res.status(201).json({ message: 'Restaurant added successfully' });
  } catch (error) {
    console.error('Error adding restaurant:', error);
    res.status(500).json({ message: 'Internal server error' }); // Return a generic error message
  }
});

// Get restaurants by owner
NewResrouter.get('/get', async (req, res) => {
  const { ownerName } = req.query;

  try {
    if (!ownerName) {
      return res.status(400).json({ message: 'Owner name parameter missing' });
    }

    const restaurants = await NewRestaurant.find({ ownerName });

    if (!restaurants || restaurants.length === 0) {
      return res.status(404).json({ message: 'Restaurants not found' });
    }

    res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all restaurants
NewResrouter.get('/all', async (req, res) => {
  try {
    const restaurants = await NewRestaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

NewResrouter.delete('/delete/:name', async (req, res) => {
  try {
    const restaurantName = req.params.name;

    // Find the restaurant by name
    const restaurant = await NewRestaurant.findOne({ name: restaurantName });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found.' });
    }

    // Delete the restaurant
    await NewRestaurant.deleteOne({ name: restaurantName });

    // Delete all tables associated with the restaurant
    await Table.deleteMany({ restaurantName });

    res.status(200).json({ message: 'Restaurant and associated tables deleted successfully.' });
  } catch (error) {
    console.error('Error deleting restaurant and tables:', error);
    res.status(500).json({ message: 'Error deleting restaurant and tables.' });
  }
});

export default NewResrouter;
