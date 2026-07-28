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
type TypedServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export const handleChatEvents = (socket: TypedSocket, _io: TypedServer) => {
  const { userId } = socket.data;

  // Join a chat room
  socket.on('chat:join_room', (roomId: string) => {
    socket.join(`chat:${roomId}`);
    logger.debug(`User ${userId} joined chat room: ${roomId}`);
  });

  // Send a message
  socket.on('chat:send_message', (payload) => {
    const { roomId, message } = payload;
    // Broadcast to everyone in the room except the sender
    socket.to(`chat:${roomId}`).emit('chat:receive_message', {
      roomId,
      message,
      senderId: userId,
    });
    logger.debug(`Message sent in chat ${roomId} by ${userId}`);
  });

  // Typing indicator
  socket.on('chat:typing', (payload) => {
    const { roomId, isTyping } = payload;
    socket.to(`chat:${roomId}`).emit('chat:typing_status', {
      roomId,
      userId,
      isTyping,
    });
  });

  // Read receipt
  socket.on('chat:read_receipt', (payload) => {
    const { roomId, messageId } = payload;
    socket.to(`chat:${roomId}`).emit('chat:message_read', {
      roomId,
      messageId,
      readBy: userId,
    });
  });
};
