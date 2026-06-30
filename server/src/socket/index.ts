import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import config from '../config';
import logger from '../utils/logger';
import { verifySocketToken } from './middlewares/auth.middleware';
import { handleConnection } from './handlers/connection.handler';
import { handleChatEvents } from './handlers/chat.handler';
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from '../types/socket.types';

export let io: SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export const initializeSocket = (httpServer: HttpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: config.corsOrigin === '*' ? true : config.corsOrigin.split(','),
      credentials: true,
    },
    // Optional: path, transports, etc.
  });

  // Apply Authentication Middleware
  io.use(verifySocketToken);

  io.on('connection', (socket) => {
    // Register Global Handlers
    handleConnection(socket, io);
    
    // Register Chat Handlers
    handleChatEvents(socket, io);
  });

  logger.info('Socket.IO server initialized successfully');
  
  return io;
};
