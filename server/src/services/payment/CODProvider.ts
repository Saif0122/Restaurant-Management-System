import { IPaymentProvider, PaymentIntentResult } from './PaymentProvider';
import { IOrder } from '../../models/Order.model';
import { IPayment } from '../../models/Payment.model';
import { IRefund } from '../../models/Refund.model';

export class CODProvider implements IPaymentProvider {
  async createIntent(order: IOrder, _amount: number): Promise<PaymentIntentResult> {
    // For COD, we don't have an intent with a client secret, just returning a placeholder.
    return {
      transactionId: `COD-${order.orderNumber}-${Date.now()}`,
      providerResponse: { method: 'Cash on Delivery', status: 'Pending Collection' },
    };
  }

  async confirmPayment(_payment: IPayment, _providerResponse: any): Promise<boolean> {
    // COD is confirmed manually by the delivery rider or admin.
    return true;
  }

  async processRefund(
    _refund: IRefund,
    _payment: IPayment,
  ): Promise<{ success: boolean; providerRefundId?: string; error?: string }> {
    // COD refunds would be manual (e.g., handing cash back or store credit)
    return {
      success: true, // We approve the refund logic, but no actual API call
      providerRefundId: `COD-REFUND-${Date.now()}`,
    };
  }
}
