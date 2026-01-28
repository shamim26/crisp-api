import { Request, Response } from "express";
import Order from "../../models/order.model";
import { successResponse } from "../responseController";
import asyncHandler from "../../utils/asyncHandler";

// Export Orders to CSV
export const exportOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const { startDate, endDate, status } = req.query;

    const query: any = {};

    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(String(startDate));
      if (endDate) {
        const end = new Date(String(endDate));
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const orders = await Order.find(query).populate("user", "name email");

    const csvData = orders.map((order) => {
      const user = order.user as any; // Cast populated user to any
      const userName = user?.name || "N/A";
      const userEmail = user?.email || "N/A";

      return {
        OrderID: order.id,
        OrderNumber: order.orderNumber,
        Date: order.createdAt.toISOString().split("T")[0],
        Customer: userName,
        Email: userEmail,
        Status: order.status,
        // @ts-ignore
        Total: order.totals?.grandTotal || 0,
        Payment: order.paymentMethod,
      };
    });

    // Simple CSV conversion (manual to avoid extra heavy dependencies if simple enough, or use library if present)
    const fields = [
      "OrderID",
      "OrderNumber",
      "Date",
      "Customer",
      "Email",
      "Status",
      "Total",
      "Payment",
    ];
    const csvRows = [];

    // Header
    csvRows.push(fields.join(","));

    // Rows
    csvData.forEach((row: any) => {
      const values = fields.map((field) => {
        const val = row[field] ? String(row[field]) : "";
        // Escape quotes and wrap in quotes
        return `"${val.replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(","));
    });

    const csvString = csvRows.join("\n");

    res.header("Content-Type", "text/csv");
    res.header("Content-Disposition", 'attachment; filename="orders.csv"');
    res.status(200).send(csvString);
  }
);
