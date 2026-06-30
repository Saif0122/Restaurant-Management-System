import mongoose, { Document, Schema, Types } from 'mongoose';

export enum ReservationStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  ARRIVED = 'Arrived',
  CANCELLED = 'Cancelled',
  COMPLETED = 'Completed',
  NO_SHOW = 'No-show',
}

export interface IReservation extends Document {
  customer: Types.ObjectId;
  reservationDate: Date;
  reservationTime: string; // E.g., '19:30'
  guestCount: number;
  tableNumber?: string;
  occasion?: string;
  specialRequest?: string;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema: Schema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer is required'],
    },
    reservationDate: {
      type: Date,
      required: [true, 'Reservation date is required'],
    },
    reservationTime: {
      type: String,
      required: [true, 'Reservation time is required'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please provide a valid time in HH:mm format'],
    },
    guestCount: {
      type: Number,
      required: [true, 'Guest count is required'],
      min: [1, 'At least 1 guest is required'],
      max: [20, 'Maximum 20 guests allowed per reservation. Please contact for larger events.'],
    },
    tableNumber: {
      type: String,
      trim: true,
    },
    occasion: {
      type: String,
      trim: true,
    },
    specialRequest: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: Object.values(ReservationStatus),
      default: ReservationStatus.PENDING,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
ReservationSchema.index({ customer: 1 });
ReservationSchema.index({ reservationDate: 1, status: 1 });

const Reservation = mongoose.model<IReservation>('Reservation', ReservationSchema);

export default Reservation;
