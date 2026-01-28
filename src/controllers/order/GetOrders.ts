import { Request, Response } from "express";
import Order from "../../models/order.model";
import { successResponse } from "../responseController";
import asyncHandler from "../../utils/asyncHandler";

// Get all orders with filters, search, and pagination
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    startDate,
    endDate,
    paymentMethod,
  } = req.query;

  const query: any = {};

  // Search by Order Number or Phone or Transaction ID
  if (search) {
    const searchRegex = new RegExp(String(search), "i");
    query.$or = [
      { orderNumber: searchRegex },
      { phone: searchRegex },
      { transactionId: searchRegex },
    ];
  }

  // Filter by Status
  if (status) {
    query.status = status;
  }

  // Filter by Payment Method
  if (paymentMethod) {
    query.paymentMethod = paymentMethod;
  }

  // Filter by Date Range
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
      query.createdAt.$gte = new Date(String(startDate));
    }
    if (endDate) {
      const end = new Date(String(endDate));
      end.setHours(23, 59, 59, 999);
      query.createdAt.$lte = end;
    }
  }

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const orders = await Order.find(query)
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const totalOrders = await Order.countDocuments(query);
  const totalPages = Math.ceil(totalOrders / limitNum);

  return successResponse(res, {
    statusCode: 200,
    message: "Orders fetched successfully",
    payload: {
      orders,
      totalPages,
      currentPage: pageNum,
      totalOrders,
    },
  });
});
