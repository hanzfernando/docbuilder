import PropTypes from 'prop-types';
import { useState } from 'react';
import DeleteAdminModal from './DeleteAdminModal';
import EditAdminModal from './EditAdminModal';
import { useAuthContext } from '../hooks/useAuthContext';
import ResetPasswordModal from './ResetPasswordModal';
import { resetUserPassword } from '../services/authService';
import { resetAdminPassword } from '../services/authService';

const UserTable = ({ users, onEdit, onDelete }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [resetMode, setResetMode] = useState('');
    const { user: currentUser } = useAuthContext();

    console.log(users);

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleResetPasswordClick = (user, mode) => {
        setSelectedUser(user);
        setResetMode(mode);
        setIsResetModalOpen(true);
    };

    return (
        <>
            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">#</th>
                            <th className="border border-gray-300 px-4 py-2">Full Name</th>
                            <th className="border border-gray-300 px-4 py-2">Email</th>
                            <th className="border border-gray-300 px-4 py-2">Role</th>
                            {currentUser?.role === 'admin' && (
                                <th className="border border-gray-300 px-4 py-2">Student ID</th>
                            )}
                            <th className="border border-gray-300 px-4 py-2">Organization</th>
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={user._id} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {user.firstname} {user.lastname}
                                    </td>                           
                                    <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{user.role}</td>
                                    {currentUser?.role === 'admin' && (
                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            {user.role === 'student' ? user.studentId || 'N/A' : ''}
                                        </td>
                                    )}
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {user.organization?.name || 'N/A'}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center flex gap-2">
                                        {currentUser && currentUser.role === 'admin' && (
                                            <button
                                                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-700"
                                                onClick={() => handleResetPasswordClick(user, user.role)}
                                            >
                                                Reset Password
                                            </button>
                                        )}
                                        {currentUser && currentUser.role === 'superadmin' && (
                                            <button
                                                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-700"
                                                onClick={() => handleResetPasswordClick(user, user.role)}
                                            >
                                                Reset Password
                                            </button>
                                        )}
                                        <button
                                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700"
                                            onClick={() => handleEditClick(user)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                                            onClick={() => handleDeleteClick(user)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                                >
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <DeleteAdminModal
                    isOpen={isDeleteModalOpen}
                    user={selectedUser}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDelete={onDelete}
                />
            )}

            {/* Edit Modal */}
            {isEditModalOpen && (
                <EditAdminModal
                    isOpen={isEditModalOpen}
                    user={selectedUser}
                    onClose={() => setIsEditModalOpen(false)}
                    onEdit={onEdit}
                />
            )}

            {/* Reset Password Modal */}
            {isResetModalOpen && (
                <ResetPasswordModal
                    isOpen={isResetModalOpen}
                    user={selectedUser}
                    onClose={() => setIsResetModalOpen(false)}
                    onResetPassword={
                        resetMode === 'admin' ? resetAdminPassword : resetUserPassword
                    }
                />
            )}
        </>
    );
};

UserTable.propTypes = {
    users: PropTypes.array.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default UserTable;
