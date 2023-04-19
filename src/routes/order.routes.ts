import { Router, Request, Response } from "express";
import { getAllOrders, getOrdersById } from "../controllers/OrderController";
const router = Router();

//  api/v1/job
router.get("/", getAllOrders);
router.get("/:id", getOrdersById);


export default router;
