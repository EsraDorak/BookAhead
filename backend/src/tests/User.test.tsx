import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../model/User';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Nach jedem Test wird die Datenbank zurückgesetzt und die Verbindung getrennt
afterEach(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Vor jedem Test wird die MongoMemoryServer-Verbindung neu gestartet
beforeEach(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

describe('User model tests', () => {
  it('should create a user successfully', async () => {
    const user = new User({
      name: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: 'password123',
    });
    
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe('John');
    expect(savedUser.lastName).toBe('Doe');
    expect(savedUser.email).toBe('johndoe@example.com');
    expect(savedUser.password).toBe('password123');
    expect(savedUser.isVerified).toBe(false); // Standardwert
    expect(savedUser.emailToken).toBeNull();
  });

  it('should fail to create a user without a required field', async () => {
    const user = new User({
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: 'password123',
    });

    let error: unknown;
    try {
      await user.save();
    } catch (e) {
      error = e;
    }

    if (error instanceof mongoose.Error.ValidationError) {
      expect(error.errors.name).toBeDefined();
    } else {
      throw error; 
    }
  });

  it('should fail to create a user with a duplicate email', async () => {
    const user1 = new User({
      name: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: 'password123',
    });
    await user1.save();

    const user2 = new User({
      name: 'Jane',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: 'password123',
    });

    let error: unknown;
    try {
      await user2.save();
    } catch (e) {
      error = e;
    }

    if (error instanceof mongoose.Error) {
      expect(error).toBeInstanceOf(mongoose.Error);
    } else {
      throw error;
    }
  });
});
