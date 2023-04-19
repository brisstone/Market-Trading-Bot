import { Router } from "express";
import { CreateJob, DisableJob, getAllJobs, getJobById } from "../controllers/MarketTakingController";


const router = Router();

router.post("/job", CreateJob);

router.patch("/job", DisableJob);



router.get("/", getAllJobs);

router.get("/:id", getJobById);


export default router;
