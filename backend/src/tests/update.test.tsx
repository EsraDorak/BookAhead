import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import updateRouter from '../router/update';
import User from '../model/User';
import Table from '../model/Table';

const app = express();
app.use(express.json());
app.use('/user', updateRouter);

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
  await User.deleteMany({});
  await Table.deleteMany({});
});

describe('Update User Tests', () => {
  test('should update user information', async () => {
    // Create a mock user
    const user = await User.create({
      email: 'test@example.com',
      name: 'John',
      lastName: 'Doe',
      password: 'password123',
    });

    const response = await request(app)
      .put('/user')
      .send({
        email: 'test@example.com',
        name: 'Jane',
        lastName: 'Smith',
        password: 'newpassword456',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User updated successfully');
    expect(response.body.user.name).toBe('Jane');
    expect(response.body.user.lastName).toBe('Smith');
    
    // Verify that the password was updated
    const updatedUser = await User.findOne({ email: 'test@example.com' });
    const passwordMatches = await bcrypt.compare('newpassword456', updatedUser?.password || '');
    expect(passwordMatches).toBe(true);
  });

  test('should return 400 if user is not found', async () => {
    const response = await request(app)
      .put('/user')
      .send({
        email: 'nonexistent@example.com',
        name: 'Nonexistent',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User not found');
  });

  test('should delete user profile and unblock assigned tables', async () => {
    // Create a mock user and assign them to a table
    const user = await User.create({
      email: 'deleteuser@example.com',
      name: 'UserToDelete',
      lastName: 'Doe',
      password: 'password123',
    });

    await Table.create({
      tableNumber: 1,
      restaurantName: 'TestRestaurant',
      assignedUser: 'UserToDelete',
      blocked: true,
    });

    const response = await request(app)
      .delete('/user/delete')
      .send({ email: 'deleteuser@example.com' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User profile deleted successfully');

    // Verify that the user is deleted
    const deletedUser = await User.findOne({ email: 'deleteuser@example.com' });
    expect(deletedUser).toBeNull();

    // Verify that tables assigned to the user are unblocked
    const updatedTable = await Table.findOne({ tableNumber: 1 });
    expect(updatedTable?.assignedUser).toBe('');
    expect(updatedTable?.blocked).toBe(false);
  });

  test('should return 404 if trying to delete a non-existent user', async () => {
    const response = await request(app)
      .delete('/user/delete')
      .send({ email: 'nonexistent@example.com' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });
});
