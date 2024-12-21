import axios from 'axios';
const API_URL = '/api/superadmin';

export const fetchOrganizations = async (token) => {
    const response = await axios.get(`${API_URL}/organizations`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    console.log(response.data);
    return response.data;
};

// Add Organization
export const addOrganization = async (token, organizationName) => {
    const response = await axios.post(
        `${API_URL}/organizations`,
        { name: organizationName },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

// Fetch all admin accounts
export const fetchAdminAccounts = async (token) => {
    const response = await axios.get(`${API_URL}/admins`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    console.log(response.data);
    return response.data;
};

// Add admin account
export const addAdminAccount = async (token, adminData) => {
    const response = await axios.post(
        `${API_URL}/admins`,
        adminData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};