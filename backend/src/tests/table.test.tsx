import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import tableRouter from '../router/table'; 
import Table from '../model/Table'; 

const app = express();
app.use(express.json());
app.use('/table', tableRouter);

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

describe('Table Routes', () => {
  test('should return tables for a specific restaurant', async () => {
    // Insert mock tables into the database
    await Table.create([
      { tableNumber: 1, restaurantName: 'Restaurant A', blocked: false, assignedUser: '' },
      { tableNumber: 2, restaurantName: 'Restaurant A', blocked: true, assignedUser: 'User1' },
      { tableNumber: 3, restaurantName: 'Restaurant B', blocked: false, assignedUser: '' },
    ]);

    const response = await request(app)
      .post('/table/get')
      .send({ restaurantName: 'Restaurant A' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2); // Only tables from 'Restaurant A'
    expect(response.body[0].tableNumber).toBe(1);
    expect(response.body[1].tableNumber).toBe(2);
  });

  test('should return 400 if restaurant name is missing', async () => {
    const response = await request(app)
      .post('/table/get')
      .send({}); // No restaurantName

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Restaurant name parameter missing');
  });

  test('should return 404 if no tables are found for the restaurant', async () => {
    const response = await request(app)
      .post('/table/get')
      .send({ restaurantName: 'NonExistentRestaurant' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Tables not found');
  });

  test('should return 500 on internal server error', async () => {
    // Mock the `Table.find` method to throw an error
    jest.spyOn(Table, 'find').mockImplementationOnce(() => {
      throw new Error('Database error');
    });

    const response = await request(app)
      .post('/table/get')
      .send({ restaurantName: 'Restaurant A' });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal server error');

    // Restore the original implementation
    jest.restoreAllMocks();
  });
});
