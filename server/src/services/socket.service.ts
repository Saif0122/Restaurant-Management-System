import { io } from '../socket';
import logger from '../utils/logger';

class SocketService {
  /**
   * Emit an event to a specific room or user
   * @param room The room to emit to (e.g., 'user:123', 'admin', 'order:456')
   * @param event The event name
   * @param payload The data payload
   */
  private emitToRoom(room: string, event: string, payload: any) {
    if (io) {
      // @ts-expect-error - Dynamic event string resolution
      io.to(room).emit(event, payload);
      logger.debug(`Emitted ${event} to room ${room}`);
    } else {
      logger.warn('Socket.IO is not initialized. Event not emitted.');
    }
  }

  // ==========================================
  // ORDER EVENTS
  // ==========================================
  public emitOrderCreated(orderId: string, orderData: any) {
    this.emitToRoom('staff', 'order.created', orderData);
    this.emitToRoom('kitchen', 'order.created', orderData);
    this.emitToRoom('admin', 'order.created', orderData);
    // Also notify specific order room for tracking
    this.emitToRoom(`order:${orderId}`, 'order.created', orderData);
  }

  public emitOrderConfirmed(orderId: string, orderData: any, customerId: string) {
    this.emitToRoom(`order:${orderId}`, 'order.confirmed', orderData);
    this.emitToRoom(`user:${customerId}`, 'order.confirmed', orderData);
  }

  public emitOrderPreparing(orderId: string, orderData: any, customerId: string) {
    this.emitToRoom(`order:${orderId}`, 'order.preparing', orderData);
    this.emitToRoom(`user:${customerId}`, 'order.preparing', orderData);
  }

  public emitOrderReady(orderId: string, orderData: any, customerId: string) {
    this.emitToRoom('delivery', 'order.ready', orderData);
    this.emitToRoom(`order:${orderId}`, 'order.ready', orderData);
    this.emitToRoom(`user:${customerId}`, 'order.ready', orderData);
  }

  public emitOrderOutForDelivery(orderId: string, orderData: any, customerId: string) {
    this.emitToRoom(`order:${orderId}`, 'order.out_for_delivery', orderData);
    this.emitToRoom(`user:${customerId}`, 'order.out_for_delivery', orderData);
  }

  public emitOrderDelivered(orderId: string, orderData: any, customerId: string) {
    this.emitToRoom(`order:${orderId}`, 'order.delivered', orderData);
    this.emitToRoom(`user:${customerId}`, 'order.delivered', orderData);
  }

  public emitOrderCancelled(orderId: string, orderData: any, customerId: string) {
    this.emitToRoom('staff', 'order.cancelled', orderData);
    this.emitToRoom(`order:${orderId}`, 'order.cancelled', orderData);
    this.emitToRoom(`user:${customerId}`, 'order.cancelled', orderData);
  }

  // ==========================================
  // NOTIFICATION EVENTS
  // ==========================================
  public emitNotification(room: string, title: string, message: string, data?: any) {
    this.emitToRoom(room, 'notification', { type: 'general', title, message, data });
  }

  // ==========================================
  // RESERVATION EVENTS
  // ==========================================
  public emitReservationCreated(reservationData: any) {
    this.emitToRoom('staff', 'reservation.created', reservationData);
    this.emitToRoom('admin', 'reservation.created', reservationData);
    this.emitToRoom('reservation', 'reservation.created', reservationData);
  }

  public emitReservationApproved(_reservationId: string, reservationData: any, customerId: string) {
    this.emitToRoom(`user:${customerId}`, 'reservation.approved', reservationData);
  }

  public emitReservationRejected(_reservationId: string, reservationData: any, customerId: string) {
    this.emitToRoom(`user:${customerId}`, 'reservation.rejected', reservationData);
  }

  public emitReservationCompleted(_reservationId: string, reservationData: any, customerId: string) {
    this.emitToRoom(`user:${customerId}`, 'reservation.completed', reservationData);
  }

  // ==========================================
  // PAYMENT EVENTS
  // ==========================================
  public emitPaymentSuccess(customerId: string, paymentData: any) {
    this.emitToRoom(`user:${customerId}`, 'payment.success', paymentData);
  }

  public emitPaymentFailed(customerId: string, paymentData: any) {
    this.emitToRoom(`user:${customerId}`, 'payment.failed', paymentData);
    this.emitToRoom('admin', 'payment.failed', paymentData);
  }

  public emitPaymentRefund(customerId: string, paymentData: any) {
    this.emitToRoom(`user:${customerId}`, 'payment.refund', paymentData);
    this.emitToRoom('admin', 'payment.refund', paymentData);
  }
}

export default new SocketService();
