import express from "express";
const router = express.Router();
import {
    submitPostProperty,
    submitHomeInterior,
    submitLegalServices
} from "../controllers/ownerController.js";

router.post("/post-property", submitPostProperty);
router.post("/home-interior", submitHomeInterior);
router.post("/legal-services", submitLegalServices);

export default router;
