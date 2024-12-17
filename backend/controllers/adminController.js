import User from '../models/userModel.js';
import Organization from '../models/organizationModel.js';

// Admin: Create User Account
const createUserAccount = async (req, res) => {
    try {
        const { firstname, lastname, email, password, role, organization } = req.body;

        // Validate required fields
        if (!firstname || !lastname || !email || !password || !role || !organization) {
            return res.status(400).json({
                message: 'All fields are required: firstname, lastname, email, password, role, organization'
            });
        }

        // Allowed roles for users created by admin
        const allowedRoles = ['student', 'organization'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: `Invalid role. Allowed roles: ${allowedRoles.join(', ')}`
            });
        }

        // Check if the organization exists for role assignment
        const orgExists = await Organization.findById(organization);
        if (!orgExists) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        // Check for duplicate email
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Create the user
        const newUser = await User.signup(
            firstname,
            lastname,
            email,
            password,
            role,
            organization
        );

        // Response
        res.status(201).json({
            message: 'User account created successfully',
            user: {
                id: newUser._id,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                email: newUser.email,
                role: newUser.role,
                organization: orgExists.name
            }
        });
    } catch (error) {
        console.error('Error creating user account:', error.message);
        res.status(500).json({ message: 'Failed to create user account', error: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const { role } = req.query; // Role filter
        const requestingAdminOrganization = req.user.organization; // Admin's organization ID from token
        // Allowed roles: 'student' and 'organization'
        const allowedRoles = ['student', 'organization'];

        // Build the filter object dynamically
        const filter = {
            role: { $in: allowedRoles }, // Only 'student' and 'organization' roles
            organization: requestingAdminOrganization, // Only users within the admin's organization
        };

        if (role && allowedRoles.includes(role)) {
            filter.role = role; // Additional role filter if provided
        }

        // Fetch users from the database
        const users = await User.find(filter)
            .populate('organization', 'name') // Populate the organization name
            .select('-password') // Exclude password field
            .sort({ createdAt: -1 }); // Sort by creation date descending

        res.status(200).json({
            message: 'Users retrieved successfully',
            count: users.length,
            users,
        });
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
};

export { createUserAccount, getUsers };
