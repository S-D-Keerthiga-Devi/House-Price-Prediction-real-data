import express from "express";
import { saveEmiResult, getEmiResults } from "../controllers/emiResultsController.js";

const router = express.Router();

router.post("/", saveEmiResult);
router.get("/", getEmiResults);

export default router;