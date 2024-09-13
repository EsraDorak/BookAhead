// models/Image.js
import mongoose from 'mongoose';

const AddImageSchema = new mongoose.Schema({
  restaurantName: String,
  imageUrl: String, // URL if using cloud storage or path if storing locally
});

const Image = mongoose.model('Image', AddImageSchema);
export default Image;