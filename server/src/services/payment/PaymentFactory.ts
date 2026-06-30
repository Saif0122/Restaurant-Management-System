import { PaymentMethod } from '../../models/Payment.model';
import { IPaymentProvider } from './PaymentProvider';
import { StripeProvider } from './StripeProvider';
import { CODProvider } from './CODProvider';

export class PaymentFactory {
  static getProvider(method: PaymentMethod): IPaymentProvider {
    switch (method) {
      case PaymentMethod.STRIPE:
      case PaymentMethod.CREDIT_CARD:
      case PaymentMethod.DEBIT_CARD:
        return new StripeProvider();
      case PaymentMethod.CASH_ON_DELIVERY:
        return new CODProvider();
      default:
        throw new Error(`Payment method ${method} is not currently supported.`);
    }
  }
}
