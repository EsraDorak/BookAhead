import mongoose, { Document, Schema } from 'mongoose';

export interface IRestaurantOwner extends Document {
  _id: string;
  restaurantName: string;
  address: string;
  postalCode: string;
  city: string;
  phoneNumber: string;
  email: string;
  password: string;
  date: Date;
}

const restaurantSchema = new Schema<IRestaurantOwner>({
  restaurantName: { type: String, required: true, minlength: 3, maxlength: 100 },
  address: { type: String, required: true, minlength: 5, maxlength: 100 },
  postalCode: { type: String, required: true, minlength: 3, maxlength: 10 },
  city: { type: String, required: true, minlength: 2, maxlength: 50 },
  phoneNumber: { type: String, required: true, minlength: 7, maxlength: 15 },
  email: { type: String, required: true, unique: true, minlength: 5, maxlength: 200 },
  password: { type: String, required: true, minlength: 6 },
  date: {type: Date, default: () => new Date()},
 
}, {
  timestamps: true,
});

const RestaurantOwner = mongoose.model<IRestaurantOwner>('RestaurantOwner', restaurantSchema);

export default RestaurantOwner;