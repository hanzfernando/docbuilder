import Template from '../models/templateModel.js';

// Fetch Templates
const getTemplates = async (req, res) => {
    try {
        const { role, organization } = req.user;

        // Query based on role
        const query = role === 'admin' 
            ? { organization } // Admins see all templates in their organization
            : { requiredRole: role, organization }; // Others see role-based templates

        const templates = await Template.find(query);

        if (!templates || templates.length === 0) {
            return res.status(404).json({ message: 'No templates available for your role or organization' });
        }

        res.status(200).json(templates);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching templates', error: error.message });
    }
};

// Fetch Template by ID
const getTemplateById = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, organization } = req.user;

        // Query based on role
        const query = role === 'admin'
            ? { _id: id, organization }
            : { _id: id, requiredRole: role, organization };

        const template = await Template.findOne(query);

        if (!template) {
            return res.status(404).json({ message: 'Template not found or access denied' });
        }

        res.status(200).json(template);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching template', error: error.message });
    }
};

// Create Template
const createTemplate = async (req, res) => {
    try {
        const { name, content, type, subtype, paperSize, requiredRole } = req.body;
        const { organization } = req.user;

        // Validate required fields
        if (!name || !content || !type || !requiredRole || !paperSize) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const template = new Template({
            name,
            content,
            type,
            subtype,
            paperSize,
            requiredRole,
            organization,
        });

        await template.save();

        res.status(201).json({ message: 'Template created successfully', template });
    } catch (error) {
        res.status(500).json({ message: 'Error creating template', error: error.message });
    }
};

// Update Template
const updateTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, content, type, subtype, requiredRole } = req.body;
        const { organization } = req.user;

        const template = await Template.findOne({ _id: id, organization });

        if (!template) {
            return res.status(404).json({ message: 'Template not found or access denied' });
        }

        if (name) template.name = name;
        if (content) template.content = content;
        if (type) template.type = type;
        if (subtype) template.subtype = subtype;
        if (requiredRole) template.requiredRole = requiredRole;

        await template.save();

        res.status(200).json({ message: 'Template updated successfully', template });
    } catch (error) {
        res.status(500).json({ message: 'Error updating template', error: error.message });
    }
};

// Delete Template
const deleteTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const { organization } = req.user;

        const template = await Template.findOneAndDelete({ _id: id, organization });

        if (!template) {
            return res.status(404).json({ message: 'Template not found or access denied' });
        }

        res.status(200).json({ message: 'Template deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting template', error: error.message });
    }
};

export { getTemplates, getTemplateById, createTemplate, updateTemplate, deleteTemplate };
