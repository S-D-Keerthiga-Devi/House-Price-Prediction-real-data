import express from "express";
import { getCities, getLocalitiesByCity, getRatesByLocality } from "../controllers/localitiesController.js";

const router = express.Router();

router.get("/cities", getCities);
router.get("/localities/:city", getLocalitiesByCity);
router.get("/rates", getRatesByLocality);

export default router;