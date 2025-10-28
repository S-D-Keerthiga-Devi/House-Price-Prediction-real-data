import express from 'express';
import { submitEscrowRequest } from '../controllers/escrowController.js';

const router = express.Router();

// POST /api/escrow - Submit escrow service request
router.post('/', submitEscrowRequest);

export default router;