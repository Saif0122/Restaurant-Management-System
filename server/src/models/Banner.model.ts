import mongoose, { Document, Schema } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  image: string;
  link?: string;
  active: boolean;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Banner title is required'],
      trim: true,
      maxlength: 100,
    },
    image: {
      type: String,
      required: [true, 'Banner image URL is required'],
    },
    link: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    position: {
      type: Number,
      default: 0, // Allows ordering banners, lower number = higher priority
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
BannerSchema.index({ active: 1, position: 1 });

const Banner = mongoose.model<IBanner>('Banner', BannerSchema);

export default Banner;
