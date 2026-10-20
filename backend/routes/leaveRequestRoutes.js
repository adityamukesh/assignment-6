import express from "express";
import {
  applyLeave,
  getMyLeaves,
  getMyBalance,
  getLeaveById,
  cancelLeave,
  getAllLeaves,
  updateLeaveStatus,
} from "../controllers/leaveRequestController.js";
import { authHandler, allowRoles } from "../middleware/authHandler.js";

const router = express.Router();

router.post("/", authHandler, allowRoles("employee"), applyLeave);
router.get("/my", authHandler, getMyLeaves);
router.get("/balance", authHandler, getMyBalance);
router.get("/", authHandler, allowRoles("admin"), getAllLeaves);
router.get("/:id", authHandler, getLeaveById);
router.patch("/:id/cancel", authHandler, allowRoles("employee"), cancelLeave);
router.patch("/:id/status", authHandler, allowRoles("admin"), updateLeaveStatus);

export default router;
