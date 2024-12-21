import PropTypes from 'prop-types';

const OrganizationTable = ({ organizations }) => {
    return (
        <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">#</th>
                        <th className="border border-gray-300 px-4 py-2">Organization Name</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {organizations.length > 0 ? (
                        organizations.map((org, index) => (
                            <tr key={org._id} className="hover:bg-gray-100">
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {index + 1}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {org.name}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="3"
                                className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                            >
                                No organizations found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

OrganizationTable.propTypes = {
    organizations: PropTypes.array.isRequired,
};

export default OrganizationTable;
