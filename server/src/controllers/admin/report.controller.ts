import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import reportService from '../../services/admin/report.service';

class ReportController {
  private convertToCSV(data: any[]): string {
    if (data.length === 0) {
      return '';
    }

    // Flatten logic can be applied if needed, but for simple JSON structures:
    const replacer = (_key: string, value: any) => (value === null ? '' : value);
    const header = Object.keys(data[0]);

    const csv = [
      header.join(','),
      ...data.map((row) =>
        header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','),
      ),
    ].join('\r\n');

    return csv;
  }

  private handleResponse(req: Request, res: Response, data: any[], filename: string): void {
    const format = req.query.format as string;

    if (format === 'csv') {
      const csvData = this.convertToCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      res.status(200).send(csvData);
      return;
    }

    res.status(200).json(new ApiResponse(200, data, 'Report generated successfully'));
  }

  public getSalesReport = asyncHandler(async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;
    const data = await reportService.getSalesReport(startDate as string, endDate as string);
    // For CSV, flatten orders a bit or return as JSON. Assuming JSON handles populate better, we just pass data.
    // If client requested CSV, we map it to flat structure
    const flatData = data.map((order: any) => ({
      orderNumber: order.orderNumber,
      customerName: order.customer?.fullName || 'N/A',
      total: order.total,
      status: order.orderStatus,
      date: order.createdAt,
    }));

    this.handleResponse(req, res, req.query.format === 'csv' ? flatData : data, 'sales_report');
  });

  public getRevenueReport = asyncHandler(async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;
    const data = await reportService.getRevenueReport(startDate as string, endDate as string);
    this.handleResponse(req, res, data, 'revenue_report');
  });

  public getCustomerReport = asyncHandler(async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;
    const data = await reportService.getCustomerReport(startDate as string, endDate as string);
    this.handleResponse(req, res, data, 'customer_report');
  });

  public getFoodReport = asyncHandler(async (req: Request, res: Response) => {
    const data = await reportService.getFoodReport();
    const flatData = data.map((food: any) => ({
      name: food.name,
      category: food.category?.name || 'N/A',
      stock: food.stock,
      price: food.price,
      active: food.active,
    }));
    this.handleResponse(req, res, req.query.format === 'csv' ? flatData : data, 'food_report');
  });

  public getReservationReport = asyncHandler(async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;
    const data = await reportService.getReservationReport(startDate as string, endDate as string);
    const flatData = data.map((resItem: any) => ({
      customer: resItem.customer?.fullName || 'N/A',
      date: resItem.reservationDate,
      time: resItem.reservationTime,
      guests: resItem.guestCount,
      status: resItem.status,
    }));
    this.handleResponse(
      req,
      res,
      req.query.format === 'csv' ? flatData : data,
      'reservation_report',
    );
  });
}

export default new ReportController();
