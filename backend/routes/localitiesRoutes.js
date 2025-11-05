import express from "express";
import { getCities, getLocalitiesByCity, getRatesByLocality, getRatesByCity, getCoordinatesByCity, getPropertiesForComparison, getAllPropertiesForComparison, getPropertyDetailsById } from "../controllers/localitiesController.js";

const router = express.Router();

router.get("/cities", getCities);
router.get("/localities/:city", getLocalitiesByCity);
router.get("/rates", getRatesByLocality);
router.get("/localities/:city/rates", getRatesByCity); // Add this new endpoint
router.get("/coordinates/:city/rates", getCoordinatesByCity); // Add this new endpoint
// Add this to your existing routes
router.post("/comparator", getPropertiesForComparison);
router.get("/comparator/all", getAllPropertiesForComparison);
router.get("/comparator/:id", getPropertyDetailsById); // Get property details by ID

export default router;