import { useState, useEffect } from 'react';
import OrganizationTable from '../components/OrganizationTable';
import AddOrganizationModal from '../components/AddOrganizationModal';
import { fetchOrganizations, addOrganization } from '../services/superAdminService';
import { useAuthContext } from '../hooks/useAuthContext';
import { useOrganizationContext } from '../hooks/useOrganizationContext.js';

const SuperAdminOrganizationsPage = () => {
    const { token } = useAuthContext();
    const { organizations, dispatch } = useOrganizationContext();
    const [filteredOrganizations, setFilteredOrganizations] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddOrganizationModalOpen, setIsAddOrganizationModalOpen] = useState(false);

    // Fetch organizations and populate context only if not already loaded
    useEffect(() => {
        if (organizations.length === 0) {
            const loadOrganizations = async () => {
                try {
                    const data = await fetchOrganizations(token);
                    dispatch({ type: 'SET_ORGANIZATIONS', payload: data.organizations });
                } catch (error) {
                    console.error('Failed to fetch organizations:', error);
                }
            };

            loadOrganizations();
        }
    }, [token, dispatch, organizations.length]);

    // Update filtered organizations when organizations state changes
    useEffect(() => {
        setFilteredOrganizations(organizations);
    }, [organizations]);

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = organizations.filter((org) =>
            org.name.toLowerCase().includes(query)
        );
        setFilteredOrganizations(filtered);
    };

    const handleAddOrganization = async (organizationName) => {
        try {
            const newOrganization = await addOrganization(token, organizationName);
            dispatch({ type: 'ADD_ORGANIZATION', payload: newOrganization.organization });
            setIsAddOrganizationModalOpen(false);
        } catch (error) {
            console.error('Failed to add organization:', error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Manage Organizations</h1>

            {/* Search Bar and Add Organization Button */}
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search organizations..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="border p-2 rounded w-1/3"
                />
                <button
                    onClick={() => setIsAddOrganizationModalOpen(true)}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    Add Organization
                </button>
            </div>

            {/* Table */}
            <OrganizationTable organizations={filteredOrganizations} />

            {/* Add Organization Modal */}
            <AddOrganizationModal
                isOpen={isAddOrganizationModalOpen}
                onClose={() => setIsAddOrganizationModalOpen(false)}
                onSubmit={handleAddOrganization}
            />
        </div>
    );
};

export default SuperAdminOrganizationsPage;
