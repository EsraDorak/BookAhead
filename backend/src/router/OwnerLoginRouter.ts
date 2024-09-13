import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import RestaurantOwner from '../model/Restaurant';

const OwnerLoginRouter = express.Router();

OwnerLoginRouter.post('/owner', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const owner = await RestaurantOwner.findOne({ email });
    if (!owner) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({ id: owner._id, name: owner.restaurantName });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default OwnerLoginRouter;
