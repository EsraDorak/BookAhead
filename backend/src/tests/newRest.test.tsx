import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import path from 'path';
import fs from 'fs';
import NewResrouter from '../router/newRest';
import NewRestaurant from '../model/newRestaurant';
import Table from '../model/Table';

const app = express();
app.use(express.json());
app.use('/restaurant', NewResrouter);

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
  await NewRestaurant.deleteMany({});
  await Table.deleteMany({});
});

describe('NewResrouter Tests', () => {
  test('should add a new restaurant with images', async () => {
    // Ensure the test image exists
    const imagePath = 'C:\\Users\\esrad\\Desktop\\Restaurant.png';
    if (!fs.existsSync(imagePath)) {
      throw new Error('Test image not found');
    }

    const response = await request(app)
      .post('/restaurant/add')
      .field('name', 'Restaurant A')
      .field('description', 'A nice place')
      .field('openingHours', '9:00-21:00')
      .field('stars', '5')
      .field('address', '123 Main St')
      .field('phoneNumber', '123-456-7890')
      .field('ownerName', 'Owner A')
      .attach('images', imagePath) // Attach a test image
      .attach('menuImages', imagePath);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Restaurant added successfully');

    const restaurant = await NewRestaurant.findOne({ name: 'Restaurant A' });
    expect(restaurant).toBeTruthy();
    expect(restaurant?.images.length).toBeGreaterThan(0);
    expect(restaurant?.menuImages.length).toBeGreaterThan(0);
  });

  test('should fail to add a restaurant if required fields are missing', async () => {
    const response = await request(app)
      .post('/restaurant/add')
      .field('name', 'Restaurant B') // Missing other required fields
      .attach('images', path.resolve(__dirname, 'test-image.jpg'));

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Missing required fields');
  });

  test('should get restaurants by owner', async () => {
    await NewRestaurant.create({
      name: 'Restaurant A',
      description: 'A nice place',
      openingHours: '9:00-21:00',
      stars: 5,
      address: '123 Main St',
      phoneNumber: '123-456-7890',
      ownerName: 'Owner A',
      images: [],
      menuImages: []
    });

    const response = await request(app)
      .get('/restaurant/get')
      .query({ ownerName: 'Owner A' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe('Restaurant A');
  });

  test('should return 404 if no restaurants found for the owner', async () => {
    const response = await request(app)
      .get('/restaurant/get')
      .query({ ownerName: 'NonExistentOwner' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Restaurants not found');
  });

  test('should get all restaurants', async () => {
    await NewRestaurant.create([
      {
        name: 'Restaurant A',
        description: 'A nice place',
        openingHours: '9:00-21:00',
        stars: 5,
        address: '123 Main St',
        phoneNumber: '123-456-7890',
        ownerName: 'Owner A',
        images: [],
        menuImages: []
      },
      {
        name: 'Restaurant B',
        description: 'Another nice place',
        openingHours: '10:00-22:00',
        stars: 4,
        address: '456 Another St',
        phoneNumber: '987-654-3210',
        ownerName: 'Owner B',
        images: [],
        menuImages: []
      }
    ]);

    const response = await request(app)
      .get('/restaurant/all');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  test('should delete a restaurant and associated tables', async () => {
    // Create a restaurant and associated tables
    await NewRestaurant.create({
      name: 'Restaurant A',
      description: 'A nice place',
      openingHours: '9:00-21:00',
      stars: 5,
      address: '123 Main St',
      phoneNumber: '123-456-7890',
      ownerName: 'Owner A',
      images: [],
      menuImages: []
    });

    await Table.create({
      tableNumber: 1,
      restaurantName: 'Restaurant A',
      assignedUser: '',
      blocked: false,
      reservations: []
    });

    const response = await request(app)
      .delete('/restaurant/delete/Restaurant A');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Restaurant and associated tables deleted successfully');

    const restaurant = await NewRestaurant.findOne({ name: 'Restaurant A' });
    expect(restaurant).toBeNull();

    const tables = await Table.find({ restaurantName: 'Restaurant A' });
    expect(tables).toHaveLength(0);
  });

  test('should return 404 if trying to delete a non-existent restaurant', async () => {
    const response = await request(app)
      .delete('/restaurant/delete/NonExistentRestaurant');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Restaurant not found.');
  });
});
