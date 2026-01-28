import { Request, Response } from "express";
import Order from "../../models/order.model";
import { errorResponse, successResponse } from "../responseController";
import asyncHandler from "../../utils/asyncHandler";

// Get Single Order
export const getOrderById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate({
        path: "items.product_id",
        select: "name images",
      });

    if (!order) {
      return errorResponse(res, {
        statusCode: 404,
        message: "Order not found",
      });
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Order fetched successfully",
      payload: order,
    });
  }
);
