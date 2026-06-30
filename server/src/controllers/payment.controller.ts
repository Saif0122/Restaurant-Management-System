import { Request, Response } from 'express';
import paymentService from '../services/payment.service';
import logger from '../utils/logger';

export const createIntent = async (req: Request, res: Response) => {
  try {
    const { orderId, paymentMethod } = req.body;
    const customerId = (req as any).user.userId;

    const result = await paymentService.createIntent(orderId, paymentMethod, customerId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    logger.error('Create Intent Error:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.body;

    // Check if user owns payment or is admin, for simplicity assuming confirm is allowed by owner
    const result = await paymentService.confirmPayment(paymentId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    logger.error('Confirm Payment Error:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;
  try {
    // req.body should be raw buffer here
    await paymentService.handleWebhook(req.body, signature);
    res.status(200).json({ received: true });
  } catch (error: any) {
    logger.error('Webhook Error:', error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

export const getHistory = async (req: Request, res: Response) => {
  try {
    const isAdmin = (req as any).user.role === 'Admin';
    const query = {
      ...req.query,
      isAdmin,
      customerId: isAdmin ? req.query.customerId : (req as any).user.userId,
    };

    const result = await paymentService.getHistory(query);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    logger.error('Get History Error:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const isAdmin = (req as any).user.role === 'Admin';
    const customerId = isAdmin ? undefined : (req as any).user.userId;

    const result = await paymentService.getPaymentById(req.params.id, customerId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    logger.error('Get Payment By ID Error:', error.message);
    res.status(404).json({ success: false, message: error.message });
  }
};

export const requestRefund = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user.userId;
    const { amount, reason } = req.body;

    const result = await paymentService.requestRefund(req.params.id, customerId, amount, reason);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    logger.error('Request Refund Error:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const approveRefund = async (req: Request, res: Response) => {
  try {
    const { adminRemarks } = req.body;
    const result = await paymentService.approveRefund(req.params.id, adminRemarks);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    logger.error('Approve Refund Error:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const rejectRefund = async (req: Request, res: Response) => {
  try {
    const { adminRemarks } = req.body;
    const result = await paymentService.rejectRefund(req.params.id, adminRemarks);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    logger.error('Reject Refund Error:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};
