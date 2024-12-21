import User from '../models/userModel.js';
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


export { loginUser, getUserDetails };

