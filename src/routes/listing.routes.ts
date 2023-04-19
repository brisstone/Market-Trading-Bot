import { Router } from "express";
import { getAllListings } from "../controllers/ListingsController";

const router = Router();

//  api/v1/listing
router.get("/", getAllListings);

export default router;
