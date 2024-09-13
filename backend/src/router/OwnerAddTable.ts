import express, { Request, Response } from 'express';
import Table from '../model/Table';
import { ITable } from '../types';
import { Types } from 'mongoose';
import { startOfWeek, endOfWeek, parseISO } from 'date-fns';



const OwnerAddTable = express.Router();

OwnerAddTable.post('/add', async (req, res) => {
  try {
    const { tableNumber, restaurantName, assignedUser, blocked, reservations } = req.body;

    // Check if tableNumber already exists for the restaurant
    const existingTable = await Table.findOne({ tableNumber, restaurantName });
    if (existingTable) {
      return res.status(400).json({ message: 'Table number already exists for this restaurant.' });
    }

    // Create a new table
    const newTable = new Table({
      tableNumber,
      restaurantName,
      assignedUser,
      blocked,
      reservations
    });

    // Save the new table to the database
    const savedTable = await newTable.save();
    res.status(201).json(savedTable);
  } catch (error) {
    console.error('Error adding table:', error);
    res.status(500).json({ message: 'Error adding table. Please try again.' });
  }
});
OwnerAddTable.get('/getSelect', async (req, res) => {
  const { restaurantName } = req.query;

  try {
    if (!restaurantName) {
      return res.status(400).json({ message: 'Restaurant name parameter missing' });
    }

    const tables = await Table.find({ restaurantName });

    if (!tables || tables.length === 0) {
      return res.status(404).json({ message: 'Tables not found' });
    }

    res.status(200).json(tables);
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

OwnerAddTable.get('/get', async (req: Request, res: Response) => {
  const { restaurantName } = req.query;

  try {
    const tables = await Table.find({ restaurantName });

    // Ensure tables have reservations array intact
    const tablesWithReservations = tables.map(table => ({
      ...table.toJSON(),
      reservations: table.reservations // Ensure reservations are array of objects [{ reservationDate: 'YYYY-MM-DD', reservationTime: 'HH:mm', guestName: 'Name' }]
    }));

    res.json(tablesWithReservations);
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ message: 'Failed to fetch tables' });
  }
});
OwnerAddTable.get('/getOwner', async (req, res) => {
  const { restaurantName } = req.query;

  try {
    const tables = await Table.find({ restaurantName });
    res.status(200).json(tables);
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ message: 'Error fetching tables. Please try again.' });
  }
});


OwnerAddTable.post('/reserve', async (req, res) => {
  try {
    const { tableNumber, restaurantName, user, reservationDate, reservationTime } = req.body;
    const table = await Table.findOne({ tableNumber, restaurantName });

    if (!table) {
      return res.status(404).send('Table not found');
    }

    table.reservations.push({ user, reservationDate, reservationTime });
    await table.save();

    res.json(table);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

 OwnerAddTable.post('/free', async (req, res) => {
  const { tableId, reservationId } = req.body;

  try {
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }

    // Ensure `reservationId` is a valid ObjectId
    const reservationObjectId = new Types.ObjectId(reservationId);

    // Use Mongoose's `pull` method to remove the reservation
    table.reservations.pull({ _id: reservationObjectId });

    await table.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Error freeing table:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



OwnerAddTable.get('/blocked-tables', async (req, res) => {
  try {
    const { userName } = req.query;
    const blockedTables = await Table.find({ 'reservations.user': userName });
    res.json(blockedTables);
  } catch (error) {
    console.error('Error fetching blocked tables:', error);
    res.status(500).send('Server error');
  }
});

OwnerAddTable.delete('/delete/:tableNumber', async (req, res) => {
  try {
    const { tableNumber } = req.params;

    // Find the table by its table number and delete it
    const table = await Table.findOneAndDelete({ tableNumber: tableNumber });

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    res.status(200).json({ message: 'Table deleted successfully' });
  } catch (error) {
    console.error('Error deleting table:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
OwnerAddTable.delete('/:tableNumber/reservations', async (req, res) => {
  try {
    const { tableNumber } = req.params;
    const { reservationDate, reservationTime, user } = req.body;

    // Find the table by its number
    const table = await Table.findOne({ tableNumber: tableNumber });

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Remove the specific reservation
    table.reservations = table.reservations.filter(reservation =>
      !(reservation.reservationDate === reservationDate &&
        reservation.reservationTime === reservationTime &&
        reservation.user === user)
    ) as any;

    // Save the updated table
    await table.save();

    res.status(200).json({ message: 'Reservation deleted successfully', updatedTable: table });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default OwnerAddTable;
