import { IOrder } from '../../models/Order.model';
import { IPayment } from '../../models/Payment.model';
import { IRefund } from '../../models/Refund.model';

export interface PaymentIntentResult {
  clientSecret?: string;
  transactionId?: string;
  providerResponse?: any;
}

export interface IPaymentProvider {
  createIntent(order: IOrder, amount: number): Promise<PaymentIntentResult>;
  confirmPayment(payment: IPayment, providerResponse: any): Promise<boolean>;
  processRefund(
    refund: IRefund,
    payment: IPayment,
  ): Promise<{ success: boolean; providerRefundId?: string; error?: string }>;
}
