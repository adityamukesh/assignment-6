import express from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import { authHandler, allowRoles } from "../middleware/authHandler.js";

const router = express.Router();

router.get("/", authHandler, allowRoles("admin"), getDashboard);

export default router;
