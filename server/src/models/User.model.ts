import mongoose, { Document, Schema } from 'mongoose';

export enum UserRole {
  CUSTOMER = 'Customer',
  STAFF = 'Staff',
  KITCHEN_STAFF = 'Kitchen Staff',
  CASHIER = 'Cashier',
  WAITER = 'Waiter',
  DELIVERY_RIDER = 'Delivery Rider',
  MANAGER = 'Manager',
  ADMIN = 'Admin',
}

export interface IUser extends Document {
  isActive: boolean;
  isDeleted: boolean;
  fullName: string;
  email: string;
  password?: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isVerified: boolean;
  refreshToken?: string;
  passwordChangedAt?: Date;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters long'],
      maxlength: [50, 'Full name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: false, // Optional for OAuth
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false, // Don't return password by default
    },
    phone: {
      type: String,
      required: false,
      trim: true,
    },
    avatar: {
      type: String,
      required: false,
      default: 'https://via.placeholder.com/150',
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
    },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false, select: false },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    passwordChangedAt: {
      type: Date,
      select: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenExpires: {
      type: Date,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.verificationToken;
        delete ret.verificationTokenExpires;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
        return ret;
      },
    },
  },
);

// Indexes for faster lookups
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ resetPasswordToken: 1 });
UserSchema.index({ verificationToken: 1 });

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
