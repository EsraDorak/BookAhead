import { Document } from 'mongoose';

export interface ITable extends Document {
  tableNumber: number;
  restaurantName: string;
  assignedUser?: string;
  blocked: boolean;
  reservationTime?: string;
  reservationDate?: string;
}
