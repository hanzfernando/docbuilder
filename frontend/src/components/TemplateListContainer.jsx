import { useEffect } from 'react';
import { useTemplateContext } from '../hooks/useTemplateContext';
import { fetchTemplates, deleteTemplate } from '../services/templateService';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/authUtil';
import { useAuthContext } from '../hooks/useAuthContext'; // Assuming you have this hook to get user info

const TemplateListContainer = () => {
    const { templates, loading, error, dispatch } = useTemplateContext();
    const { user } = useAuthContext(); // Get user from auth context
    const navigate = useNavigate();
    // console.log('User:', user);

    useEffect(() => {
        const loadTemplates = async () => {
            dispatch({ type: 'SET_LOADING', payload: true });
            try {
                const token = getToken();
                const fetchedTemplates = await fetchTemplates(token); // Use your fetchTemplates service here
                dispatch({ type: 'SET_TEMPLATES', payload: fetchedTemplates });
            } catch (err) {
                console.error(err);
                dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch templates. Please try again later.' });
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        loadTemplates();
    }, [dispatch]);

    const handleDeleteTemplate = async (templateId) => {
        try {
            const token = getToken();
            await deleteTemplate(templateId, token); // Call delete service
            dispatch({ type: 'DELETE_TEMPLATE', payload: templateId }); // Dispatch reducer action
            alert('Template deleted successfully');
        } catch (err) {
            console.error('Failed to delete template:', err.message);
            alert(err.message || 'Failed to delete template. Please try again.');
        }
    };

    if (loading) return <p>Loading templates...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Available Templates</h2>
            {templates.length === 0 ? (
                <p>No templates available for your organization.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templates.map((template) => (
                        <div
                            key={template._id}
                            className="border rounded p-4 shadow hover:shadow-lg transition-shadow duration-300 bg-white"
                        >
                            <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                            <p className="text-gray-700 mb-1">
                                <strong>Type:</strong> {template.type}
                            </p>
                            <p className="text-gray-700 mb-1">
                                <strong>Subtype:</strong> {template.subtype || 'N/A'}
                            </p>
                            <p className="text-gray-700">
                                <strong>Role:</strong> {template.requiredRole}
                            </p>
                            <div className="mt-4 flex justify-between">
                                <button
                                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                                    onClick={() =>
                                        navigate(
                                            user.role === 'admin'
                                                ? `/templates/${template._id}`
                                                : `/user-templates/${template._id}`
                                        )
                                    }
                                >
                                    View
                                </button>
                                {user.role === 'admin' && (
                                    <button
                                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                                        onClick={() => handleDeleteTemplate(template._id)}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TemplateListContainer;
