import express, { Request, Response } from 'express';
import Table from '../model/Table';

const tableRouter = express.Router();

// Get all tables for a specific restaurant
tableRouter.post('/get', async (req: Request, res: Response) => {
  const { restaurantName } = req.body;

  try {
    if (!restaurantName) {
      return res.status(400).json({ message: 'Restaurant name parameter missing' });
    }

    console.log('Fetching tables for restaurant:', restaurantName);
    const tables = await Table.find({ restaurantName });
    console.log('Tables found:', tables);

    if (!tables || tables.length === 0) {
      return res.status(404).json({ message: 'Tables not found' });
    }

    res.status(200).json(tables);
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Get blocked tables for a specific user
// tableRouter.get('/blocked-tables', async (req: Request, res: Response) => {
//   const { userName } = req.query;
//   if (!userName) {
//     return res.status(400).json({ message: 'User name is required' });
//   }

//   try {
//     const tables = await Table.find({ assignedUser: userName, blocked: true });
//     res.json(tables);
//   } catch (error) {
//     console.error('Error fetching blocked tables:', error);
//     res.status(500).json({ message: 'Error fetching blocked tables' });
//   }
// });

// Update table assignment for a specific restaurant
// tableRouter.post('/update', async (req: Request, res: Response) => {
//   const { tableNumber, assignedUser, blocked, restaurantName, reservationTime } = req.body;
//   if (!restaurantName || !tableNumber) {
//     return res.status(400).json({ message: 'Restaurant name and table number are required' });
//   }

//   try {
//     const name = getRestaurantName(restaurantName);
//     console.log(`Updating table ${tableNumber} for restaurant ${name} with user ${assignedUser}, blocked status ${blocked}, and reservation time ${reservationTime}`);
//     const updatedTable = await Table.findOneAndUpdate(
//       { tableNumber, restaurantName: name },
//       { assignedUser, blocked, reservationTime },
//       { new: true }
//     );

//     if (!updatedTable) {
//       console.error('Table not found');
//       return res.status(404).json({ message: 'Table not found' });
//     }

//     res.status(200).json({ message: 'Table assignment updated successfully', updatedTable });
//   } catch (error) {
//     console.error('Error updating table assignment:', error);
//     res.status(500).json({ message: 'Error updating table assignment' });
//   }
// });

export default tableRouter;