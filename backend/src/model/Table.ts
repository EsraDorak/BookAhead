import { Schema, model, Document, Types } from 'mongoose';

interface Reservation {
  _id: Types.ObjectId;
  user: string;
  reservationDate: string;
  reservationTime: string;
}

interface TableDocument extends Document {
  tableNumber: number;
  restaurantName: string;
  reservations: Types.DocumentArray<Reservation>;
}

const ReservationSchema = new Schema<Reservation>({
  user: { type: String, required: true },
  reservationDate: { type: String, required: true },
  reservationTime: { type: String, required: true }
});

const TableSchema = new Schema<TableDocument>({
  tableNumber: { type: Number, required: true },
  restaurantName: { type: String, required: true },
  reservations: { type: [ReservationSchema], default: [] }
});

const Table = model<TableDocument>('Table', TableSchema);

export default Table;
