import { Router } from "express";
import { getOrders } from "../controllers/order/GetOrders";
import { getOrderById } from "../controllers/order/GetOrderById";
import { updateOrderStatus } from "../controllers/order/UpdateOrderStatus";
import { bulkUpdateStatus } from "../controllers/order/BulkUpdateStatus";
import { deleteOrder } from "../controllers/order/DeleteOrder";
import { exportOrders } from "../controllers/order/ExportOrders"; // Import new export controller
import isLoggedIn from "../middlewares/isLoggedIn";
import isAdmin from "../middlewares/isAdmin";

const router = Router();

// Public routes (if any, e.g. tracking?) or User routes
// For now assuming admin/user protected

router.use(isLoggedIn); // All order routes require login

// Admin only list/manage? Or User see own?
// Current implementation assumes Admin dashboard usage primarily.
// TODO: Split routes if user-facing history is needed.

router.get("/", isAdmin, getOrders);
router.get("/export", isAdmin, exportOrders); // Add export route
router.post("/bulk-status", isAdmin, bulkUpdateStatus);
router.get("/:id", getOrderById); // User might need this if we check ownership
router.patch("/:id/status", isAdmin, updateOrderStatus); // Admin updates status
router.delete("/:id", isAdmin, deleteOrder);

export default router;
