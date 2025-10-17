import express from 'express';
import { estimateValuation } from '../controllers/valuationController.js';

const router = express.Router();

router.post('/estimate', estimateValuation);

export default router;


