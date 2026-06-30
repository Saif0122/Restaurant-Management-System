import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAuditLog extends Document {
  admin: Types.ObjectId;
  action: string;
  resource: string;
  resourceId?: Types.ObjectId;
  previousState?: any;
  newState?: any;
  createdAt: Date;
  updatedAt: Date;
}

const AuditLogSchema: Schema = new Schema(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Admin user is required'],
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      trim: true,
    },
    resource: {
      type: String,
      required: [true, 'Resource name is required'],
      trim: true,
    },
    resourceId: {
      type: Schema.Types.ObjectId,
    },
    previousState: {
      type: Schema.Types.Mixed,
    },
    newState: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    capped: { size: 52428800, max: 100000 }, // Optional: Make it a capped collection (50MB or 100K docs)
  },
);

// Indexes
AuditLogSchema.index({ admin: 1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ createdAt: -1 });

const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

export default AuditLog;
