import PropTypes from 'prop-types';
import { useState } from 'react';
import DeleteAdminModal from './DeleteAdminModal';
import EditAdminModal from './EditAdminModal';

const UserTable = ({ users, onEdit, onDelete }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
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
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {user.organization?.name || 'N/A'}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center flex gap-2">
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
        </>
    );
};

UserTable.propTypes = {
    users: PropTypes.array.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default UserTable;
