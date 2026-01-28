import { Request, Response } from "express";
import Order from "../../models/order.model";
import { errorResponse, successResponse } from "../responseController";
import asyncHandler from "../../utils/asyncHandler";

// Delete Order
export const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await Order.findByIdAndUpdate(id, { isDeleted: true });

  if (!order) {
    return errorResponse(res, { statusCode: 404, message: "Order not found" });
  }

  return successResponse(res, {
    statusCode: 200,
    message: "Order deleted successfully",
  });
});
