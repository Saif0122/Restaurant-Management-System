import nodemailer from 'nodemailer';
import config from '../config';
import logger from '../utils/logger';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.smtp.host,
      port: config.email.smtp.port,
      auth: {
        user: config.email.smtp.auth.user,
        pass: config.email.smtp.auth.pass,
      },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    html: string,
    attachments?: nodemailer.SendMailOptions['attachments'],
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: config.email.from,
        to,
        subject,
        html,
        attachments,
      });
    } catch (error) {
      logger.error('Failed to send email:', error);
      throw new Error('Could not send email');
    }
  }

  async sendPaymentSuccessEmail(to: string, orderNumber: string, amount: number): Promise<void> {
    const subject = `Payment Successful - Order #${orderNumber}`;
    const html = `<p>Your payment of $${amount.toFixed(2)} for order #${orderNumber} was successful.</p>`;
    await this.sendEmail(to, subject, html);
  }

  async sendPaymentFailedEmail(to: string, orderNumber: string): Promise<void> {
    const subject = `Payment Failed - Order #${orderNumber}`;
    const html = `<p>Your payment for order #${orderNumber} failed. Please try again.</p>`;
    await this.sendEmail(to, subject, html);
  }

  async sendRefundProcessedEmail(to: string, orderNumber: string, amount: number): Promise<void> {
    const subject = `Refund Processed - Order #${orderNumber}`;
    const html = `<p>A refund of $${amount.toFixed(2)} for order #${orderNumber} has been processed.</p>`;
    await this.sendEmail(to, subject, html);
  }

  async sendInvoiceEmail(to: string, orderNumber: string, pdfBuffer: Buffer): Promise<void> {
    const subject = `Invoice for Order #${orderNumber}`;
    const html = `<p>Please find attached the invoice for your order #${orderNumber}.</p>`;
    await this.sendEmail(to, subject, html, [
      {
        filename: `invoice-${orderNumber}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ]);
  }
}

export default new EmailService();
