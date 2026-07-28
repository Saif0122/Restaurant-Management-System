import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { SocketData } from '../../types/socket.types';

interface JwtPayload {
  id: string;
  role: string;
}

/**
 * Socket.IO authentication middleware.
 * Expects JWT token in handshake auth or headers.
 */
export const verifySocketToken = (
  socket: Socket<any, any, any, SocketData>,
  next: (err?: Error) => void,
) => {
  try {
    let token = socket.handshake.auth?.token;

    // Fallback to headers
    if (!token && socket.handshake.headers?.authorization?.startsWith('Bearer ')) {
      token = socket.handshake.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    const decoded = jwt.verify(token, config.jwt.accessSecret) as JwtPayload;

    if (!decoded.id || !decoded.role) {
      return next(new Error('Authentication error: Invalid token payload'));
    }

    // Attach user data to socket context
    socket.data.userId = decoded.id;
    socket.data.role = decoded.role;

    next();
  } catch (error: any) {
    next(new Error(`Authentication error: ${error.message}`));
  }
};
