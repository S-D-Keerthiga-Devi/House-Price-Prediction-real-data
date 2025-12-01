import express from 'express';
import { getPriceToIncomeData } from '../controllers/smartInsightsController.js';

const router = express.Router();

router.get('/price-to-income', getPriceToIncomeData);

export default router;
