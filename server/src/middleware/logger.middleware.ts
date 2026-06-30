import morgan from 'morgan';
import logger from '../utils/logger';
import config from '../config';

const stream = {
  write: (message: string) => logger.info(message.trim()),
};

const skip = (): boolean => {
  return config.env === 'test';
};

// Use standard 'combined' format for production (contains IPs, agents, etc.) and 'dev' format for local development
const format = config.env === 'production' ? 'combined' : 'dev';

export const requestLogger = morgan(format, { stream, skip });
