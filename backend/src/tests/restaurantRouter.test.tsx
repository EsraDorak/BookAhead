import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../index';  // Correct path to your app
import Restaurant from '../model/Restaurant';

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
  await Restaurant.deleteMany({});
});

describe('POST /registerOwner', () => {
  test('should register a new restaurant owner successfully', async () => {
    const restaurantData = {
      restaurantName: 'The Great Restaurant',
      address: '123 Main St',
      postalCode: '12345',
      city: 'Sample City',
      phoneNumber: '1234567890',
      email: 'owner@example.com',
      password: 'StrongPassword123!',
    };

    const response = await request(app)
      .post('/restaurant/registerOwner')
      .send(restaurantData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Registration successful');

    const restaurant = await Restaurant.findOne({ email: 'owner@example.com' });
    expect(restaurant).toBeTruthy();
    expect(restaurant?.restaurantName).toBe(restaurantData.restaurantName);
    expect(restaurant?.city).toBe(restaurantData.city);
  });

  test('should return 400 if email is already in use', async () => {
    await Restaurant.create({
      restaurantName: 'Old Restaurant',
      address: '456 Another St',
      postalCode: '67890',
      city: 'Old City',
      phoneNumber: '9876543210',
      email: 'owner@example.com',
      password: 'AnotherPassword123!',
    });

    const restaurantData = {
      restaurantName: 'The Great Restaurant',
      address: '123 Main St',
      postalCode: '12345',
      city: 'Sample City',
      phoneNumber: '1234567890',
      email: 'owner@example.com',
      password: 'StrongPassword123!',
    };

    const response = await request(app)
      .post('/restaurant/registerOwner')
      .send(restaurantData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email already in use');
  });

  test('should return 500 if there is a server error', async () => {
    jest.spyOn(Restaurant.prototype, 'save').mockImplementationOnce(() => {
      throw new Error('Database save error');
    });

    const restaurantData = {
      restaurantName: 'The Great Restaurant',
      address: '123 Main St',
      postalCode: '12345',
      city: 'Sample City',
      phoneNumber: '1234567890',
      email: 'owner@example.com',
      password: 'StrongPassword123!',
    };

    const response = await request(app)
      .post('/restaurant/registerOwner')
      .send(restaurantData);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal server error');
  });
});
