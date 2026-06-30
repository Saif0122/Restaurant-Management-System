import mongoose, { Document, Schema, Types } from 'mongoose';

export enum AddressLabel {
  HOME = 'Home',
  WORK = 'Work',
  OTHER = 'Other',
}

export interface IAddress extends Document {
  customer: Types.ObjectId;
  label: AddressLabel;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    type: string;
    coordinates: number[];
  };
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema: Schema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer is required'],
    },
    label: {
      type: String,
      enum: Object.values(AddressLabel),
      default: AddressLabel.HOME,
    },
    street: {
      type: String,
      required: [true, 'Street is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required'],
      trim: true,
    },
    country: {
      type: String,
      default: 'United States',
      trim: true,
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
AddressSchema.index({ customer: 1 });
AddressSchema.index({ coordinates: '2dsphere' });

// Pre-save hook to ensure only one default address exists per customer
AddressSchema.pre('save', async function (this: any) {
  if (this.isDefault) {
    await this.model('Address').updateMany(
      { customer: this.customer, _id: { $ne: this._id } },
      { $set: { isDefault: false } },
    );
  }
});

const Address = mongoose.model<IAddress>('Address', AddressSchema);

export default Address;
