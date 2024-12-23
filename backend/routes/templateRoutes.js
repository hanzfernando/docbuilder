import express from 'express';
import {
    createTemplate,
    getTemplates,
    getTemplateById,
    updateTemplate,
    deleteTemplate,
} from '../controllers/templateController.js';
import { authToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Admin-only routes
router.post('/', authToken, requireAdmin, createTemplate); // Create template
router.put('/:id', authToken, requireAdmin, updateTemplate); // Update template
router.delete('/:id', authToken, requireAdmin, deleteTemplate); // Delete template

// Shared route for admins and users
router.get('/', authToken, getTemplates); // Fetch templates based on role and organization
router.get('/:id', authToken, getTemplateById); // Fetch specific template by ID

export default router;
