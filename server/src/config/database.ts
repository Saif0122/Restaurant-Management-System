import mongoose from 'mongoose';
import config from './index';
import logger from '../utils/logger';

// Register connection listeners
mongoose.connection.on('connected', () => {
  logger.info('Mongoose default connection is open');
});

mongoose.connection.on('error', (err) => {
  logger.error(`Mongoose default connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Mongoose default connection is disconnected');
});

/**
 * Establish connection to MongoDB.
 */
export const connectDB = async (): Promise<void> => {
  try {
    const dbOptions = config.db.options;
    logger.info('Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri, dbOptions);
  } catch (error) {
    logger.error('CRITICAL: Initial MongoDB connection failure:', error);
    process.exit(1);
  }
};

/**
 * Gracefully close the MongoDB connection.
 */
export const closeDB = async (): Promise<void> => {
  try {
    logger.info('Closing MongoDB connection...');
    await mongoose.connection.close();
    logger.info('MongoDB connection closed successfully.');
  } catch (error) {
    logger.error('Error during MongoDB connection closure:', error);
  }
};
