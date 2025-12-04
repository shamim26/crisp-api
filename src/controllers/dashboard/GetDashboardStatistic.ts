import { Request, Response, NextFunction } from "express";
import User from "../../models/user.model";
import Order from "../../models/order.model";
import Product from "../../models/product.model";
import { successResponse } from "../responseController";

export const GetDashboardStatistic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenueResult,
      orderStatusBreakdown,
      recentOrders,
    ] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments(),
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totals.grandTotal" },
          },
        },
      ]),
      Order.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "name email")
        .select("orderNumber status totals createdAt"),
    ]);

    const totalRevenue =
      totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;

    successResponse(res, {
      message: "Dashboard statistics fetched successfully",
      data: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue,
        orderStatusBreakdown,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};
