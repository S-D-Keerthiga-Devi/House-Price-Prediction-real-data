import express from 'express';
import userAuth from '../middleware/userAuth.js';
import {
  createRentAgreement,
  getUserRentAgreements,
  getRentAgreementById,
  updateRentAgreement,
  deleteRentAgreement
} from '../controllers/rentAgreementController.js';

const router = express.Router();

// Create a new rent agreement
router.post('/', userAuth, createRentAgreement);

// Get all rent agreements for a user
router.get('/', userAuth, getUserRentAgreements);

// Get a specific rent agreement
router.get('/:id', userAuth, getRentAgreementById);

// Update a rent agreement
router.put('/:id', userAuth, updateRentAgreement);

// Delete a rent agreement
router.delete('/:id', userAuth, deleteRentAgreement);

export default router;