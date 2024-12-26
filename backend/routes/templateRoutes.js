import express from 'express';
import {
    createTemplate,
    getTemplates,
    getTemplateById,
    updateTemplate,
    deleteTemplate,
    fetchDecisionTree,
    getTemplateHeaderById,
} from '../controllers/templateController.js';
import { authToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router(); 

// Shared route for admins and users
router.get('/decision-tree', authToken, fetchDecisionTree); // Fetch decision tree for a template
router.get('/', authToken, getTemplates); // Fetch templates based on role and organization
router.get('/:id', authToken, getTemplateById); // Fetch specific template by ID
router.get('/headers/:id', authToken, getTemplateHeaderById); // Fetch specific template by ID

// Admin-only routes
router.post('/', authToken, requireAdmin, createTemplate); // Create template
router.put('/:id', authToken, requireAdmin, updateTemplate); // Update template
router.delete('/:id', authToken, requireAdmin, deleteTemplate); // Delete template


export default router;
