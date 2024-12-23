import User from '../models/userModel.js';
import Template from '../models/templateModel.js';
import generateToken from '../utils/generateToken.js';


// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log(email, password);
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Authenticate user
        const user = await User.login(email, password); // Calls the login method in the userModel
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        console.log(user);
        // Generate token
        const token = generateToken(user._id, user.role);

        // Return user data and token
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

const getUserDetails = async (req, res) => {
    try {
        // Find user by ID, populate the organization name, and exclude the password field
        const user = await User.findById(req.user._id)
            .populate({
                path: 'organization', // Populate the 'organization' field
                select: 'name',       // Include only the 'name' field from Organization
                options: { nullable: true } // Ensure nullable if the organization does not exist
            })
            .select('-password'); // Exclude password field

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user details:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// Create a new template
const createTemplate = async (req, res) => {
    try {
        const { name, content, type, subtype, requiredRole, organization } = req.body;

        if (!name || !content || !type || !requiredRole || !organization) {
            return res.status(400).json({ message: 'All required fields must be provided.' });
        }

        const newTemplate = new Template({
            name,
            content,
            type,
            subtype,
            requiredRole,
            organization,
        });

        const savedTemplate = await newTemplate.save();
        res.status(201).json(savedTemplate);
    } catch (error) {
        res.status(500).json({ message: 'Error creating template', error: error.message });
    }
};

// Get all templates
const getTemplates = async (req, res) => {
    try {
        const templates = await Template.find().populate('organization', 'name'); // Populate organization details if needed
        res.status(200).json(templates);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching templates', error: error.message });
    }
};

// Get a template by ID
const getTemplateById = async (req, res) => {
    try {
        const template = await Template.findById(req.params.id).populate('organization', 'name');
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }
        res.status(200).json(template);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching template', error: error.message });
    }
};

// Update a template
const updateTemplate = async (req, res) => {
    try {
        const { name, content, type, subtype, requiredRole, organization } = req.body;

        const updatedTemplate = await Template.findByIdAndUpdate(
            req.params.id,
            { name, content, type, subtype, requiredRole, organization },
            { new: true } // Return the updated document
        );

        if (!updatedTemplate) {
            return res.status(404).json({ message: 'Template not found' });
        }

        res.status(200).json(updatedTemplate);
    } catch (error) {
        res.status(500).json({ message: 'Error updating template', error: error.message });
    }
};

// Delete a template
const deleteTemplate = async (req, res) => {
    try {
        const deletedTemplate = await Template.findByIdAndDelete(req.params.id);

        if (!deletedTemplate) {
            return res.status(404).json({ message: 'Template not found' });
        }

        res.status(200).json({ message: 'Template deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting template', error: error.message });
    }
};

export { loginUser, getUserDetails, createTemplate, getTemplates, getTemplateById, updateTemplate, deleteTemplate };

