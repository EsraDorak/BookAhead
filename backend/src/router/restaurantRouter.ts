import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Restaurant from '../model/Restaurant';

const restaurantRouter = express.Router();

restaurantRouter.post('/registerOwner', async (req: Request, res: Response) => {
  try {
    const { restaurantName, address, postalCode, city, phoneNumber, email, password } = req.body;

    // Check if email already exists
    const existingRestaurant = await Restaurant.findOne({ email });
    if (existingRestaurant) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const restaurant = new Restaurant({
      restaurantName,
      address,
      postalCode,
      city,
      phoneNumber,
      email,
      password: hashedPassword,
    });

    const savedRestaurant = await restaurant.save();
    console.log('Restaurant saved:', savedRestaurant);  // Add this line to log saved restaurant data
    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error registering restaurant:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


export default restaurantRouter;
