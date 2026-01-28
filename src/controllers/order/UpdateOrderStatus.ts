import { Request, Response } from "express";
import Order from "../../models/order.model";
import { errorResponse, successResponse } from "../responseController";
import asyncHandler from "../../utils/asyncHandler";
import { io } from "../../utils/socket"; // Import socket instance

// Update Order Status
export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Refunded",
    ];

    if (!validStatuses.includes(status)) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Invalid status provided",
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("user", "name email");

    if (!order) {
      return errorResponse(res, {
        statusCode: 404,
        message: "Order not found",
      });
    }

    // Emit Socket Event
    if (io) {
      io.emit("order_updated", order);
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Order status updated successfully",
      payload: order,
    });
  }
);
