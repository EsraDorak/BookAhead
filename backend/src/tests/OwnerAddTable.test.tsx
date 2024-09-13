import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import OwnerAddTable from '../router/OwnerAddTable'; 
import Table from '../model/Table'; 

const app = express();
app.use(express.json());
app.use('/table', OwnerAddTable);

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Table.deleteMany({});
});

describe('OwnerAddTable Routes', () => {
  test('should add a new table', async () => {
    const response = await request(app)
      .post('/table/add')
      .send({
        tableNumber: 1,
        restaurantName: 'Restaurant A',
        assignedUser: '',
        blocked: false,
        reservations: []
      });

    expect(response.status).toBe(201);
    expect(response.body.tableNumber).toBe(1);
    expect(response.body.restaurantName).toBe('Restaurant A');
  });

  test('should not add a table with an existing table number', async () => {
    // Insert a mock table
    await Table.create({
      tableNumber: 1,
      restaurantName: 'Restaurant A',
      assignedUser: '',
      blocked: false,
      reservations: []
    });

    const response = await request(app)
      .post('/table/add')
      .send({
        tableNumber: 1,
        restaurantName: 'Restaurant A',
        assignedUser: '',
        blocked: false,
        reservations: []
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Table number already exists for this restaurant.');
  });

  test('should fetch tables for a specific restaurant', async () => {
    await Table.create([
      { tableNumber: 1, restaurantName: 'Restaurant A', assignedUser: '', blocked: false, reservations: [] },
      { tableNumber: 2, restaurantName: 'Restaurant A', assignedUser: '', blocked: true, reservations: [] },
      { tableNumber: 3, restaurantName: 'Restaurant B', assignedUser: '', blocked: false, reservations: [] }
    ]);

    const response = await request(app)
      .get('/table/get')
      .query({ restaurantName: 'Restaurant A' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2); // Should only fetch tables for 'Restaurant A'
  });

  test('should reserve a table', async () => {
    const table = await Table.create({
      tableNumber: 1,
      restaurantName: 'Restaurant A',
      assignedUser: '',
      blocked: false,
      reservations: []
    });

    const response = await request(app)
      .post('/table/reserve')
      .send({
        tableNumber: 1,
        restaurantName: 'Restaurant A',
        user: 'User1',
        reservationDate: '2023-09-08',
        reservationTime: '12:00'
      });

    expect(response.status).toBe(200);
    expect(response.body.reservations).toHaveLength(1);
    expect(response.body.reservations[0].user).toBe('User1');
  });

  test('should delete a specific reservation', async () => {
    const table = await Table.create({
      tableNumber: 1,
      restaurantName: 'Restaurant A',
      assignedUser: '',
      blocked: false,
      reservations: [
        { user: 'User1', reservationDate: '2023-09-08', reservationTime: '12:00' }
      ]
    });

    const response = await request(app)
      .delete('/table/1/reservations')
      .send({
        reservationDate: '2023-09-08',
        reservationTime: '12:00',
        user: 'User1'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Reservation deleted successfully');
    expect(response.body.updatedTable.reservations).toHaveLength(0);
  });

  test('should delete a table', async () => {
    const table = await Table.create({
      tableNumber: 1,
      restaurantName: 'Restaurant A',
      assignedUser: '',
      blocked: false,
      reservations: []
    });

    const response = await request(app)
      .delete(`/table/delete/${table.tableNumber}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Table deleted successfully');

    const deletedTable = await Table.findOne({ tableNumber: 1 });
    expect(deletedTable).toBeNull();
  });

  test('should return 404 if deleting non-existent table', async () => {
    const response = await request(app)
      .delete(`/table/delete/999`); // Non-existent table number

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Table not found');
  });
});
