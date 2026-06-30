import Stripe from 'stripe';
import config from '../../config';
import { IPaymentProvider, PaymentIntentResult } from './PaymentProvider';
import { IOrder } from '../../models/Order.model';
import { IPayment } from '../../models/Payment.model';
import { IRefund } from '../../models/Refund.model';
import logger from '../../utils/logger';

export class StripeProvider implements IPaymentProvider {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(config.stripe.secretKey);
  }

  async createIntent(order: IOrder, amount: number): Promise<PaymentIntentResult> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects cents
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
      },
    });

    return {
      clientSecret: paymentIntent.client_secret || undefined,
      transactionId: paymentIntent.id,
      providerResponse: paymentIntent,
    };
  }

  async confirmPayment(payment: IPayment, _providerResponse: any): Promise<boolean> {
    try {
      const intentId = payment.transactionId;
      if (!intentId) {
        return false;
      }
      const intent = await this.stripe.paymentIntents.retrieve(intentId);
      return intent.status === 'succeeded';
    } catch (error) {
      logger.error('Error confirming Stripe payment:', error);
      return false;
    }
  }

  async processRefund(
    refund: IRefund,
    payment: IPayment,
  ): Promise<{ success: boolean; providerRefundId?: string; error?: string }> {
    try {
      if (!payment.transactionId) {
        return { success: false, error: 'No transaction ID found for payment.' };
      }

      const stripeRefund = await this.stripe.refunds.create({
        payment_intent: payment.transactionId,
        amount: Math.round(refund.amount * 100),
        reason: 'requested_by_customer',
        metadata: {
          refundId: refund._id.toString(),
          orderId: refund.order.toString(),
        },
      });

      return {
        success: stripeRefund.status === 'succeeded' || stripeRefund.status === 'pending',
        providerRefundId: stripeRefund.id,
      };
    } catch (error: any) {
      logger.error('Error processing Stripe refund:', error);
      return { success: false, error: error.message };
    }
  }
}
