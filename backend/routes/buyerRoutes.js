import express from "express";
const router = express.Router();
import {
    submitPropertyValuation,
    submitHomeLoan,
    submitFacilityManagement
} from "../controllers/buyerController.js";

router.post("/property-valuation", submitPropertyValuation);
router.post("/home-loan", submitHomeLoan);
router.post("/facility-management", submitFacilityManagement);

export default router;
