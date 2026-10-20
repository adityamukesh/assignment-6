import express from "express";
import {
  getLeaveTypes,
  getLeaveTypeById,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType,
} from "../controllers/leaveTypeController.js";
import { authHandler, allowRoles } from "../middleware/authHandler.js";

const router = express.Router();

router.get("/", authHandler, getLeaveTypes);
router.get("/:id", authHandler, getLeaveTypeById);
router.post("/", authHandler, allowRoles("admin"), createLeaveType);
router.put("/:id", authHandler, allowRoles("admin"), updateLeaveType);
router.delete("/:id", authHandler, allowRoles("admin"), deleteLeaveType);

export default router;
