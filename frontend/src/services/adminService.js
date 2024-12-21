import axios from 'axios';
const API_URL = '/api/admin'; // Adjust based on your API structure

// Fetch user accounts
export const fetchUserAccounts = async (token) => {
    const response = await axios.get(`${API_URL}/users`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Add a user account
export const addUserAccount = async (token, userDetails) => {
    const response = await axios.post(`${API_URL}/users`, userDetails, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};