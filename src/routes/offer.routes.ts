import { Router } from "express";
import { getAllOffers, getOffersByOrderId } from "../controllers/OfferController";

const router = Router();

//  api/v1/job
router.get("/", getAllOffers);

router.get("/:order_id", getOffersByOrderId);

export default router;
