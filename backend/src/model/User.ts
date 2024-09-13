import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  date: Date;
  isVerified: boolean;
  emailToken: string | null;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, minlength: 3, maxlength: 30 },
  lastName: { type: String, required: true, minlength: 3, maxlength: 30 },
  email: { type: String, required: true, unique: true, minlength: 3, maxlength: 200 },
  password: { type: String, required: true },
  date: {type: Date, default: () => new Date()},
  isVerified: { type: Boolean, default: false },
  emailToken: { type: String}
}, {
  timestamps: true,
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;