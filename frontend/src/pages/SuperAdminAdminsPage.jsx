import { useState, useEffect } from 'react';
import UserTable from '../components/UserTable';
import AddAdminModal from '../components/AddAdminModal';
import { fetchAdminAccounts, addAdminAccount, editAdminAccount, deleteAdminAccount } from '../services/superAdminService';
import { useAuthContext } from '../hooks/useAuthContext';
import { useUserContext } from '../hooks/useUserContext';

const SuperAdminAdminsPage = () => {
    const { token } = useAuthContext();
    const { users, dispatch } = useUserContext();
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);

    console.log('Users:', users);
    // Fetch users and populate context only if not already loaded
    useEffect(() => {
        if (users.length === 0) {
            const loadUsers = async () => {
                try {
                    const data = await fetchAdminAccounts(token);
                    dispatch({ type: 'SET_USERS', payload: data.admins });
                } catch (error) {
                    console.error('Failed to fetch users:', error);
                }
            };

            loadUsers();
        }
    }, [token, dispatch, users.length]);

    // Update filtered users when the context changes
    useEffect(() => {
        setFilteredUsers(users);
    }, [users]);

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = users.filter((user) =>
            `${user.firstname} ${user.lastname}`.toLowerCase().includes(query) ||
            (user.organization?.name || '').toLowerCase().includes(query)
        );
        setFilteredUsers(filtered);
    };

    const handleAddAdmin = async (userDetails) => {
        try {
            const newUser = await addAdminAccount(token, userDetails);
            console.log('New user:', newUser);
            dispatch({ type: 'ADD_USER', payload: newUser.user });
            setIsAddAdminModalOpen(false);
        } catch (error) {
            console.error('Failed to add user:', error);
        }
    };

    const handleEditAdmin = async (userId, updatedData) => {
        try {
            await editAdminAccount(token, userId, updatedData);
            dispatch({
                type: 'SET_USERS',
                payload: users.map((user) =>
                    user._id === userId ? { ...user, ...updatedData } : user
                ),
            });
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };
    
    const handleDeleteAdmin = async (userId) => {
        try {
            await deleteAdminAccount(token, userId);
            dispatch({
                type: 'SET_USERS',
                payload: users.filter((user) => user._id !== userId),
            });            
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Manage Admins</h1>

            {/* Search Bar and Add Admin Button */}
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="border p-2 rounded w-1/3"
                />
                <button
                    onClick={() => setIsAddAdminModalOpen(true)}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    Add Admin
                </button>
            </div>

            {/* User Table */}
            <UserTable
                users={filteredUsers}
                onEdit={handleEditAdmin}
                onDelete={handleDeleteAdmin}
            />;

            {/* Add User Modal */}
            <AddAdminModal
                isOpen={isAddAdminModalOpen}
                onClose={() => setIsAddAdminModalOpen(false)}
                onSubmit={handleAddAdmin}
            />
        </div>
    );
};

export default SuperAdminAdminsPage;
