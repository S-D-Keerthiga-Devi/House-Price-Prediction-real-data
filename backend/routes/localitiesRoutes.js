import express from "express";
import { getCities, getLocalitiesByCity, getRatesByLocality, getRatesByCity, getCoordinatesByCity } from "../controllers/localitiesController.js";

const router = express.Router();

router.get("/cities", getCities);
router.get("/localities/:city", getLocalitiesByCity);
router.get("/rates", getRatesByLocality);
router.get("/localities/:city/rates", getRatesByCity); // Add this new endpoint
router.get("/coordinates/:city/rates", getCoordinatesByCity); // Add this new endpoint

export default router;