import express from 'express';
import * as dashboardController from './dashboard.controller.js';
import { requireAuth, requireRole } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Only ADMIN and optionally RECEPTIONIST/DOCTOR can view overall dashboard.
// For now protecting it for ADMIN
router.use(requireAuth);

router.get(
    '/statistics',
    requireRole(['ADMIN']), // Modify as needed if other roles are allowed
    dashboardController.getDashboardStats
);

export default router;
