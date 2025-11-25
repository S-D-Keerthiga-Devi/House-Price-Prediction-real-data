import express from "express";
const router = express.Router();
import {
    submitAdvertise,
    submitVentureInvestment
} from "../controllers/developerController.js";

router.post("/advertise", submitAdvertise);
router.post("/venture-investment", submitVentureInvestment);

export default router;
