import config from './config';
import logger from './utils/logger';
import { connectDB, closeDB } from './config/database';
import app from './app';
import { Server } from 'http';
import { initializeSocket } from './socket';

let server: Server;

/**
 * Bootstrap the server application.
 */
const startServer = async (): Promise<void> => {
  try {
    // 1. Establish Database Connection
    await connectDB();

    // 2. Start HTTP Server
    server = app.listen(config.port, () => {
      logger.info('=================================');
      logger.info(`  Server is running on port: ${config.port}`);
      logger.info(`  Environment: ${config.env}`);
      logger.info('=================================');
    });

    // 3. Initialize Socket.IO Server
    initializeSocket(server);
  } catch (error) {
    logger.error('CRITICAL: Server boot failed:', error);
    process.exit(1);
  }
};

startServer();

// 3. Handle Process Level Exceptions and Rejections
process.on('uncaughtException', (error: Error) => {
  logger.error(
    `CRITICAL: Uncaught Exception! Shutting down... Error: ${error.message}\nStack: ${error.stack}`,
  );
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown) => {
  logger.error(`CRITICAL: Unhandled Rejection! Shutting down... Reason: ${reason}`);
  if (server) {
    server.close(() => {
      closeDB().then(() => {
        process.exit(1);
      });
    });
  } else {
    process.exit(1);
  }
});

// 4. Graceful Shutdown on SIGINT (Ctrl+C) and SIGTERM (System kill)
const gracefulShutdown = (signal: string): void => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  if (server) {
    server.close(() => {
      logger.info('HTTP server closed.');
      closeDB().then(() => {
        logger.info('Graceful shutdown complete.');
        process.exit(0);
      });
    });
  } else {
    closeDB().then(() => {
      logger.info('Graceful shutdown complete.');
      process.exit(0);
    });
  }

  // Force quit if graceful shutdown hangs
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
