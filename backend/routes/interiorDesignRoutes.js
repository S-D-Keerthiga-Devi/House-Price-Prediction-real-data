// routes/interiorDesignRoutes.js
import express from "express";
import { generateDesign, listDesigns } from "../controllers/interiorDesignController.js";

const router = express.Router();

// Public endpoints (no auth)
router.post("/generate", generateDesign);
router.get("/", listDesigns);

export default router;
