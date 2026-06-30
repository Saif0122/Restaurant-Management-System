import PDFDocument from 'pdfkit';
import { IOrder } from '../models/Order.model';
import { IUser } from '../models/User.model';

class InvoiceService {
  /**
   * Generates a PDF invoice for an order.
   * Returns a Promise that resolves with a Buffer containing the PDF data.
   */
  async generateInvoice(order: IOrder, user: IUser): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });
        doc.on('error', (err: any) => {
          reject(err);
        });

        // Header
        doc
          .fillColor('#444444')
          .fontSize(20)
          .text('RESTAURANT INVOICE', 50, 57)
          .fontSize(10)
          .text('123 Restaurant Way', 200, 50, { align: 'right' })
          .text('City, State, ZIP', 200, 65, { align: 'right' })
          .moveDown();

        const hr = (y: number) => {
          doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
        };

        hr(90);

        // Customer Details
        const customerTop = 110;
        doc
          .fontSize(10)
          .text('Invoice Number:', 50, customerTop)
          .font('Helvetica-Bold')
          .text(`INV-${order.orderNumber}`, 150, customerTop)
          .font('Helvetica')
          .text('Invoice Date:', 50, customerTop + 15)
          .text(order.createdAt.toDateString(), 150, customerTop + 15)
          .text('Total Amount:', 50, customerTop + 30)
          .text(`$${order.total.toFixed(2)}`, 150, customerTop + 30)

          .text('Billed To:', 300, customerTop)
          .font('Helvetica-Bold')
          .text(user.fullName, 300, customerTop + 15)
          .font('Helvetica')
          .text(user.email, 300, customerTop + 30)
          .text(user.phone || '', 300, customerTop + 45);

        hr(180);

        // Invoice Table Header
        const invoiceTableTop = 210;
        doc.font('Helvetica-Bold');
        doc.text('Item', 50, invoiceTableTop);
        doc.text('Quantity', 280, invoiceTableTop, { width: 90, align: 'right' });
        doc.text('Price', 370, invoiceTableTop, { width: 90, align: 'right' });
        doc.text('Total', 470, invoiceTableTop, { width: 90, align: 'right' });

        hr(230);
        doc.font('Helvetica');

        let position = 250;
        // In a real scenario, we'd populate food names from a populated order
        // Assuming we just have the price and quantity here, or food is populated
        for (let i = 0; i < order.items.length; i++) {
          const item = order.items[i];
          const foodName = (item.food as any).name || `Item ID: ${item.food.toString()}`;
          const total = item.quantity * item.price;

          doc.text(foodName, 50, position);
          doc.text(item.quantity.toString(), 280, position, { width: 90, align: 'right' });
          doc.text(`$${item.price.toFixed(2)}`, 370, position, { width: 90, align: 'right' });
          doc.text(`$${total.toFixed(2)}`, 470, position, { width: 90, align: 'right' });

          position += 20;
        }

        hr(position + 10);

        // Subtotal, Tax, Discount, Total
        const summaryTop = position + 30;
        doc.text('Subtotal:', 370, summaryTop, { width: 90, align: 'right' });
        doc.text(`$${order.subtotal.toFixed(2)}`, 470, summaryTop, { width: 90, align: 'right' });

        doc.text('Tax:', 370, summaryTop + 20, { width: 90, align: 'right' });
        doc.text(`$${order.tax.toFixed(2)}`, 470, summaryTop + 20, { width: 90, align: 'right' });

        doc.text('Discount:', 370, summaryTop + 40, { width: 90, align: 'right' });
        doc.text(`-$${order.discount.toFixed(2)}`, 470, summaryTop + 40, {
          width: 90,
          align: 'right',
        });

        doc.font('Helvetica-Bold');
        doc.text('Total:', 370, summaryTop + 60, { width: 90, align: 'right' });
        doc.text(`$${order.total.toFixed(2)}`, 470, summaryTop + 60, { width: 90, align: 'right' });

        // Footer
        doc
          .font('Helvetica')
          .fontSize(10)
          .text('Thank you for your business!', 50, 700, { align: 'center', width: 500 });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default new InvoiceService();
