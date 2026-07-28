import { Socket, Server } from 'socket.io';
import logger from '../../utils/logger';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from '../../types/socket.types';

type TypedSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export const handleConnection = (
  socket: TypedSocket,
  _io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
) => {
  const { userId, role } = socket.data;

  // 1. Join Personal Room
  const userRoom = `user:${userId}`;
  socket.join(userRoom);

  // 2. Join Role-Based Rooms
  if (role) {
    socket.join(role); // e.g., 'admin', 'staff', 'customer'
  }

  logger.info(`Socket connected: ${socket.id} | User: ${userId} | Role: ${role}`);

  // 3. Generic Join/Leave Handlers
  socket.on('join_room', (room: string) => {
    // Basic authorization for some rooms could be added here
    socket.join(room);
    logger.debug(`User ${userId} joined room: ${room}`);
  });

  socket.on('leave_room', (room: string) => {
    socket.leave(room);
    logger.debug(`User ${userId} left room: ${room}`);
  });

  // 4. Handle Disconnect
  socket.on('disconnect', (reason) => {
    logger.info(`Socket disconnected: ${socket.id} | User: ${userId} | Reason: ${reason}`);
  });

  socket.on('error', (err) => {
    logger.error(`Socket error: ${socket.id} | User: ${userId} | Error: ${err.message}`);
  });
};
