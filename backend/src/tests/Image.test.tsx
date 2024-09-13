import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Image from '../model/Images'; 
import request from 'supertest';
import express from 'express';

// Initialize Express app for testing
const app = express();
app.use(express.json());

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
  await Image.deleteMany({});
});

describe('Image Model Tests', () => {
  test('should create and save an image successfully', async () => {
    const imageData = {
      restaurantName: 'Test Restaurant',
      imageUrl: 'C:\\Users\\esrad\\Desktop\\Restaurant.png',
    };

    const image = new Image(imageData);
    const savedImage = await image.save();

    expect(savedImage._id).toBeDefined();
    expect(savedImage.restaurantName).toBe(imageData.restaurantName);
    expect(savedImage.imageUrl).toBe(imageData.imageUrl);
  });

  test('should retrieve an image by restaurant name', async () => {
    const imageData = {
      restaurantName: 'Test Restaurant',
      imageUrl: 'C:\\Users\\esrad\\Desktop\\Restaurant.png',
    };

    await new Image(imageData).save();

    const image = await Image.findOne({ restaurantName: 'Test Restaurant' });
    expect(image).toBeTruthy();
    expect(image?.imageUrl).toBe(imageData.imageUrl);
  });

  test('should update an image URL successfully', async () => {
    const imageData = {
      restaurantName: 'Test Restaurant',
      imageUrl: 'C:\\Users\\esrad\\Desktop\\Restaurant.png',
    };

    const image = await new Image(imageData).save();

    const updatedData = { imageUrl: 'C:\\Users\\esrad\\Desktop\\Restaurant.png' };
    await Image.updateOne({ _id: image._id }, updatedData);

    const updatedImage = await Image.findById(image._id);
    expect(updatedImage?.imageUrl).toBe(updatedData.imageUrl);
  });

  test('should delete an image successfully', async () => {
    const imageData = {
      restaurantName: 'Test Restaurant',
      imageUrl: 'C:\\Users\\esrad\\Desktop\\Restaurant.png',
    };

    const image = await new Image(imageData).save();
    await Image.deleteOne({ _id: image._id });

    const deletedImage = await Image.findById(image._id);
    expect(deletedImage).toBeNull();
  });

  test('should return 404 if trying to retrieve a non-existent image', async () => {
    const response = await request(app)
      .get('/images/invalid-id'); // Adjust to your actual route if testing REST API

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Image not found');
  });
});
