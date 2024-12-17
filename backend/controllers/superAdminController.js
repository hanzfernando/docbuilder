import Organization from '../models/organizationModel.js';
import User from '../models/userModel.js';

// Create Organization
const createOrganization = async (req, res) => {
    const { name } = req.body;

    try {
        if (!name) throw new Error('Organization name is required');

        const organization = await Organization.create({ name });
        res.status(201).json({ message: 'Organization created', organization });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Create Admin Account
const createAdminAccount = async (req, res) => {
    const { firstname, lastname, email, password, organization } = req.body;

    try {
        if (!firstname || !lastname || !email || !password || !organization) {
            throw new Error('All fields are required');
        }

        const adminUser = await User.signup(firstname, lastname, email, password, 'admin', organization);
        res.status(201).json({ message: 'Admin account created', user: adminUser });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get All Organizations
const getOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.find({});
        res.status(200).json({ message: 'Organizations retrieved', organizations });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Admin Accounts
const getAdminAccounts = async (req, res) => {
    try {
        const adminAccounts = await User.find({ role: 'admin' }).populate('organization', 'name');
        res.status(200).json({ message: 'Admin accounts retrieved', admins: adminAccounts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createOrganization, createAdminAccount, getOrganizations, getAdminAccounts };
