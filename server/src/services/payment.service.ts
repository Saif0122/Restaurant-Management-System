import Stripe from 'stripe';
import { Types } from 'mongoose';
import config from '../config';
import Order, { PaymentStatus, OrderStatus, IOrder } from '../models/Order.model';
import Payment, { PaymentMethod, IPayment } from '../models/Payment.model';
import Refund, { RefundStatus } from '../models/Refund.model';
import User from '../models/User.model';
import { PaymentFactory } from './payment/PaymentFactory';
import emailService from './email.service';
import invoiceService from './invoice.service';
import logger from '../utils/logger';

class PaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(config.stripe.secretKey);
  }

  async createIntent(orderId: string, paymentMethod: PaymentMethod, customerId: string) {
    const order = await Order.findById(orderId).populate('customer');
    if (!order) {
      throw new Error('Order not found');
    }
    if (order.customer._id.toString() !== customerId) {
      throw new Error('Unauthorized to pay for this order');
    }
    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new Error('Order is already paid');
    }

    const provider = PaymentFactory.getProvider(paymentMethod);
    const intentResult = await provider.createIntent(order, order.total);

    // Create or update the payment record
    let payment = await Payment.findOne({ order: order._id });
    if (!payment) {
      payment = new Payment({
        order: order._id,
        customer: order.customer._id,
        paymentMethod,
        transactionId: intentResult.transactionId,
        amount: order.total,
        currency: 'USD',
        status: PaymentStatus.PENDING,
        providerResponse: intentResult.providerResponse,
      });
    } else {
      payment.paymentMethod = paymentMethod;
      payment.transactionId = intentResult.transactionId;
      payment.providerResponse = intentResult.providerResponse;
    }
    await payment.save();

    // Update order reference
    order.payment = payment._id as Types.ObjectId;
    await order.save();

    return {
      paymentId: payment._id,
      clientSecret: intentResult.clientSecret, // Used by frontend to complete Stripe payment
      transactionId: intentResult.transactionId,
    };
  }

  async confirmPayment(paymentId: string) {
    const payment = await Payment.findById(paymentId).populate('order customer');
    if (!payment) {
      throw new Error('Payment not found');
    }
    if (payment.status === PaymentStatus.PAID) {
      return payment;
    }

    const provider = PaymentFactory.getProvider(payment.paymentMethod);
    const isSuccess = await provider.confirmPayment(payment, payment.providerResponse);

    if (isSuccess) {
      payment.status = PaymentStatus.PAID;
      await payment.save();

      const order = await Order.findById(payment.order).populate('customer items.food');
      if (order) {
        order.paymentStatus = PaymentStatus.PAID;
        order.orderStatus = OrderStatus.CONFIRMED; // Advance order status
        order.statusHistory.push({
          status: OrderStatus.CONFIRMED,
          note: 'Payment received',
          updatedAt: new Date(),
        });
        await order.save();

        const customer = await User.findById(order.customer);
        if (customer) {
          await emailService.sendPaymentSuccessEmail(
            customer.email,
            order.orderNumber,
            order.total,
          );

          try {
            const pdfBuffer = await invoiceService.generateInvoice(order, customer);
            await emailService.sendInvoiceEmail(customer.email, order.orderNumber, pdfBuffer);
          } catch (err) {
            logger.error('Failed to generate or send invoice', err);
          }
        }
      }
    } else {
      payment.status = PaymentStatus.FAILED;
      await payment.save();

      const order = await Order.findById(payment.order).populate('customer');
      if (order) {
        order.paymentStatus = PaymentStatus.FAILED;
        await order.save();

        const customer = await User.findById(order.customer);
        if (customer) {
          await emailService.sendPaymentFailedEmail(customer.email, order.orderNumber);
        }
      }
    }

    return payment;
  }

  async handleWebhook(rawBody: string | Buffer, signature: string) {
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, config.stripe.webhookSecret);
    } catch (err: any) {
      logger.error('Webhook signature verification failed.', err.message);
      throw new Error(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;

      if (!orderId) {
        logger.warn('Webhook received but no orderId in metadata.');
        return;
      }

      const payment = await Payment.findOne({ order: orderId, transactionId: paymentIntent.id });
      if (payment && payment.status !== PaymentStatus.PAID) {
        await this.confirmPayment(payment._id.toString());
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const payment = await Payment.findOne({ transactionId: paymentIntent.id });
      if (payment && payment.status !== PaymentStatus.FAILED) {
        payment.status = PaymentStatus.FAILED;
        await payment.save();

        const order = await Order.findById(payment.order);
        if (order) {
          order.paymentStatus = PaymentStatus.FAILED;
          await order.save();

          const customer = await User.findById(order.customer);
          if (customer) {
            await emailService.sendPaymentFailedEmail(customer.email, order.orderNumber);
          }
        }
      }
    }
  }

  async getHistory(query: any) {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (query.customerId) {
      filter.customer = query.customerId;
    }
    if (query.status) {
      filter.status = query.status;
    }
    if (query.paymentMethod) {
      filter.paymentMethod = query.paymentMethod;
    }

    const payments = await Payment.find(filter)
      .populate('order', 'orderNumber total orderStatus createdAt')
      .populate('customer', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Payment.countDocuments(filter);

    // Calculate revenue analytics if admin
    let revenue = 0;
    if (query.isAdmin) {
      const revenueResult = await Payment.aggregate([
        { $match: { status: PaymentStatus.PAID } },
        { $group: { _id: null, totalRevenue: { $sum: '$amount' } } },
      ]);
      revenue = revenueResult[0]?.totalRevenue || 0;
    }

    return {
      payments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      ...(query.isAdmin && { totalRevenue: revenue }),
    };
  }

  async getPaymentById(paymentId: string, customerId?: string) {
    const payment = await Payment.findById(paymentId)
      .populate('order')
      .populate('customer', 'fullName email phone');

    if (!payment) {
      throw new Error('Payment not found');
    }

    // If customerId is provided, enforce ownership
    if (customerId && payment.customer._id.toString() !== customerId) {
      throw new Error('Unauthorized access to payment details');
    }
    return payment;
  }

  async requestRefund(paymentId: string, customerId: string, amount: number, reason: string) {
    const payment = await Payment.findById(paymentId).populate('order');
    if (!payment) {
      throw new Error('Payment not found');
    }
    if (payment.customer.toString() !== customerId) {
      throw new Error('Unauthorized');
    }
    if (payment.status !== PaymentStatus.PAID) {
      throw new Error('Only paid payments can be refunded');
    }
    if (amount > payment.amount) {
      throw new Error('Refund amount cannot exceed payment amount');
    }

    const existingRefund = await Refund.findOne({
      payment: paymentId,
      status: { $in: [RefundStatus.PENDING, RefundStatus.APPROVED] },
    });
    if (existingRefund) {
      throw new Error('A refund is already pending or approved for this payment');
    }

    const refund = new Refund({
      order: payment.order,
      payment: payment._id,
      customer: customerId,
      amount,
      reason,
      status: RefundStatus.PENDING,
    });

    await refund.save();
    return refund;
  }

  async approveRefund(refundId: string, adminRemarks: string) {
    const refund = await Refund.findById(refundId).populate('payment order customer');
    if (!refund) {
      throw new Error('Refund request not found');
    }
    if (refund.status !== RefundStatus.PENDING) {
      throw new Error('Refund is not pending');
    }

    const payment = refund.payment as any as IPayment; // Cast for types
    const provider = PaymentFactory.getProvider(payment.paymentMethod);

    const result = await provider.processRefund(refund, payment);

    if (result.success) {
      refund.status = RefundStatus.COMPLETED; // For Stripe, it might be pending, but we'll mark completed for simplicity
      refund.adminRemarks = adminRemarks;
      refund.providerRefundId = result.providerRefundId;
      await refund.save();

      payment.status = PaymentStatus.REFUNDED;
      await payment.save();

      const order = await Order.findById(refund.order);
      if (order) {
        order.paymentStatus = PaymentStatus.REFUNDED;
        order.orderStatus = OrderStatus.CANCELLED; // Typically, if full refund, order is cancelled
        await order.save();
      }

      const customer = await User.findById(refund.customer);
      if (customer) {
        await emailService.sendRefundProcessedEmail(
          customer.email,
          (order as IOrder).orderNumber,
          refund.amount,
        );
      }
    } else {
      throw new Error(`Provider failed to process refund: ${result.error}`);
    }

    return refund;
  }

  async rejectRefund(refundId: string, adminRemarks: string) {
    const refund = await Refund.findById(refundId);
    if (!refund) {
      throw new Error('Refund request not found');
    }
    if (refund.status !== RefundStatus.PENDING) {
      throw new Error('Refund is not pending');
    }

    refund.status = RefundStatus.REJECTED;
    refund.adminRemarks = adminRemarks;
    await refund.save();

    return refund;
  }
}

export default new PaymentService();
