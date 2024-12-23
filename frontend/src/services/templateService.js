import axios from 'axios';

const API_URL = '/api/templates';

const createTemplate = async (templateData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`, // Include auth token
        },
    };

    try {
        const response = await axios.post(API_URL, templateData, config);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error creating template');
    }
};

const fetchTemplates = async (token) => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error fetching templates');
    }
};

const getTemplateById = async (templateId, token) => {
    try {
        const response = await axios.get(`${API_URL}/${templateId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching template by ID:', error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch the template. Please try again.');
    }
};

const updateTemplate = async (templateId, templateData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`, // Include auth token
        },
    };

    try {
        const response = await axios.put(`${API_URL}/${templateId}`, templateData, config);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error updating template');
    }
};

export { createTemplate, fetchTemplates, getTemplateById, updateTemplate };
