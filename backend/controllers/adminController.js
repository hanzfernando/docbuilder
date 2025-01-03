import User from '../models/userModel.js';
import Organization from '../models/organizationModel.js';

// Admin: Create User Account
const createUserAccount = async (req, res) => {
    try {
        const { firstname, lastname, email, password, role, organization } = req.body;

        // Validate required fields
        if (!firstname || !lastname || !email || !password || !role || !organization) {
            return res.status(400).json({
                message: 'All fields are required: firstname, lastname, email, password, role, organization',
            });
        }

        // Allowed roles for users created by admin
        const allowedRoles = ['student', 'organization'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: `Invalid role. Allowed roles: ${allowedRoles.join(', ')}`,
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

        // Populate organization for the response
        const populatedUser = await User.findById(newUser._id).populate('organization', 'name');

        // Response
        res.status(201).json({
            message: 'User account created successfully',
            user: {
                _id: populatedUser._id, // Ensure _id is included
                firstname: populatedUser.firstname,
                lastname: populatedUser.lastname,
                email: populatedUser.email,
                role: populatedUser.role,
                organization: populatedUser.organization?.name || null, // Ensure null for superadmin
            },
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
            .populate('organization', '_id name') // Populate the organization name
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

// Edit User Account
const editUserAccount = async (req, res) => {
    const { id } = req.params; // User account ID
    const { firstname, lastname, email, password, organization, role } = req.body;

    try {
        if (!id) throw new Error('User account ID is required');
        if (!firstname && !lastname && !email && !password && !organization && !role) {
            throw new Error('At least one field is required to update');
        }

        const updateData = {};

        if (firstname) updateData.firstname = firstname;
        if (lastname) updateData.lastname = lastname;
        if (email) updateData.email = email;
        if (password) updateData.password = await User.hashPassword(password); // Hash new password
        if (organization) updateData.organization = organization;
        if (role) updateData.role = role;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('organization', 'name');

        if (!updatedUser) throw new Error('User account not found');

        res.status(200).json({ message: 'User account updated successfully', user: updatedUser });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete User Account
const deleteUserAccount = async (req, res) => {
    const { id } = req.params; // User account ID

    try {
        if (!id) throw new Error('User account ID is required');

        // Find and delete the user in the User table
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) throw new Error('User account not found');

        res.status(200).json({
            message: 'User account and associated record deleted successfully',
            user: deletedUser,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export { createUserAccount, getUsers, editUserAccount, deleteUserAccount };
