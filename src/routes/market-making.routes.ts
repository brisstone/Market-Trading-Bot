import { Router, Request, Response } from "express";
import {
  CreateJob,
  DisableJob,
  getAllJobs,
  getJobById,
} from "../controllers/MarketMakingController";

const router = Router();

//  api/v1/job
router.post("/job", CreateJob);


router.patch("/job", DisableJob);

router.get("/", getAllJobs);

router.get("/:id", getJobById);

export default router;
