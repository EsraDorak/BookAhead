import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../model/User';
import Table from '../model/Table'; // Import the Table model

const update = express.Router();

// Update user information
update.put('/', async (req: Request, res: Response) => {
  try {
    const { email, name, lastName, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (name) {
      user.name = name;
    }

    if (lastName) {
      user.lastName = lastName;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete user profile
update.delete('/delete', async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOneAndDelete({ email });

    if (user) {
      // Unblock tables assigned to the user
      await Table.updateMany(
        { assignedUser: user.name },
        { $set: { assignedUser: '', blocked: false, reservationTime: '' } }
      );

      res.status(200).json({ message: 'User profile deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default update;
