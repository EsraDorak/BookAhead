import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Table from '../model/Table'; // Adjust the path to your Table model

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Table.deleteMany({});
});

describe('Table Model Tests', () => {
  test('should create and save a table successfully', async () => {
    const tableData = {
      tableNumber: 1,
      restaurantName: 'Sample Restaurant',
      reservations: [],
    };

    const table = new Table(tableData);
    const savedTable = await table.save();

    expect(savedTable._id).toBeDefined();
    expect(savedTable.tableNumber).toBe(tableData.tableNumber);
    expect(savedTable.restaurantName).toBe(tableData.restaurantName);
    expect(savedTable.reservations).toEqual(tableData.reservations);
  });

  test('should add a reservation to a table successfully', async () => {
    const tableData = {
      tableNumber: 1,
      restaurantName: 'Sample Restaurant',
      reservations: [],
    };

    const table = await new Table(tableData).save();

    const reservation = {
      user: 'John Doe',
      reservationDate: '2024-09-15',
      reservationTime: '19:00',
    };

    table.reservations.push(reservation);
    await table.save();

    const updatedTable = await Table.findById(table._id);
    expect(updatedTable?.reservations.length).toBe(1);
    expect(updatedTable?.reservations[0].user).toBe(reservation.user);
    expect(updatedTable?.reservations[0].reservationDate).toBe(reservation.reservationDate);
    expect(updatedTable?.reservations[0].reservationTime).toBe(reservation.reservationTime);
  });

  test('should retrieve a table with its reservations', async () => {
    const tableData = {
      tableNumber: 1,
      restaurantName: 'Sample Restaurant',
      reservations: [{
        user: 'John Doe',
        reservationDate: '2024-09-15',
        reservationTime: '19:00',
      }],
    };

    const table = await new Table(tableData).save();

    const retrievedTable = await Table.findById(table._id);
    expect(retrievedTable).toBeTruthy();
    expect(retrievedTable?.reservations.length).toBe(1);
    expect(retrievedTable?.reservations[0].user).toBe('John Doe');
  });

  test('should update a reservation successfully', async () => {
    const tableData = {
      tableNumber: 1,
      restaurantName: 'Sample Restaurant',
      reservations: [{
        user: 'John Doe',
        reservationDate: '2024-09-15',
        reservationTime: '19:00',
      }],
    };

    const table = await new Table(tableData).save();

    const updatedReservation = {
      reservationDate: '2024-09-16',
      reservationTime: '20:00',
    };

    await Table.updateOne(
      { _id: table._id, 'reservations.user': 'John Doe' },
      { $set: { 'reservations.$.reservationDate': updatedReservation.reservationDate, 'reservations.$.reservationTime': updatedReservation.reservationTime } }
    );

    const updatedTable = await Table.findById(table._id);
    expect(updatedTable?.reservations[0].reservationDate).toBe(updatedReservation.reservationDate);
    expect(updatedTable?.reservations[0].reservationTime).toBe(updatedReservation.reservationTime);
  });

  test('should delete a reservation successfully', async () => {
    const tableData = {
      tableNumber: 1,
      restaurantName: 'Sample Restaurant',
      reservations: [{
        user: 'John Doe',
        reservationDate: '2024-09-15',
        reservationTime: '19:00',
      }],
    };

    const table = await new Table(tableData).save();

    await Table.updateOne(
      { _id: table._id },
      { $pull: { reservations: { user: 'John Doe' } } }
    );

    const updatedTable = await Table.findById(table._id);
    expect(updatedTable?.reservations.length).toBe(0);
  });
});
