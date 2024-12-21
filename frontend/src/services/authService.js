import axios from 'axios';
const API_URL = '/api/auth'
// Log in user and get token
export const logIn = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data; // Expected to return { token }
};

export const getUserDetails = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response.data);
        return response.data; // Return user details
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch user details');
    }
};
