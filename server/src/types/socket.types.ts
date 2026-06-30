export interface ServerToClientEvents {
  // Order Events
  'order.created': (payload: any) => void;
  'order.confirmed': (payload: any) => void;
  'order.preparing': (payload: any) => void;
  'order.ready': (payload: any) => void;
  'order.out_for_delivery': (payload: any) => void;
  'order.delivered': (payload: any) => void;
  'order.cancelled': (payload: any) => void;

  // Notification Events
  'notification': (payload: { type: string; title: string; message: string; data?: any }) => void;

  // Reservation Events
  'reservation.created': (payload: any) => void;
  'reservation.approved': (payload: any) => void;
  'reservation.rejected': (payload: any) => void;
  'reservation.completed': (payload: any) => void;

  // Payment Events
  'payment.success': (payload: any) => void;
  'payment.failed': (payload: any) => void;
  'payment.refund': (payload: any) => void;

  // Chat Events
  'chat:receive_message': (payload: { roomId: string; message: any; senderId: string }) => void;
  'chat:typing_status': (payload: { roomId: string; userId: string; isTyping: boolean }) => void;
  'chat:message_read': (payload: { roomId: string; messageId: string; readBy: string }) => void;
}

export interface ClientToServerEvents {
  'join_room': (room: string) => void;
  'leave_room': (room: string) => void;
  
  // Chat Events
  'chat:join_room': (roomId: string) => void;
  'chat:send_message': (payload: { roomId: string; message: any }) => void;
  'chat:typing': (payload: { roomId: string; isTyping: boolean }) => void;
  'chat:read_receipt': (payload: { roomId: string; messageId: string }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
  role: string;
}
