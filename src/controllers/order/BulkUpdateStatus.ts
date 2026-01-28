import { Request, Response } from "express";
import Order from "../../models/order.model";
import { errorResponse, successResponse } from "../responseController";
import asyncHandler from "../../utils/asyncHandler";
import { io } from "../../utils/socket";


// Bulk Update Status
export const bulkUpdateStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderIds, status } = req.body;

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return errorResponse(res, {
        statusCode: 400,
        message: "No order IDs provided",
      });
    }

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

    const result = await Order.updateMany(
      { _id: { $in: orderIds } },
      { $set: { status } }
    );

    // Emit Socket Event for bulk update (refresh list)
    if (io) {
      io.emit("orders_bulk_updated", { orderIds, status });
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Orders updated successfully",
      payload: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      },
    });
  }
);
