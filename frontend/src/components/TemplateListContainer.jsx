import { useEffect, useState } from 'react';
import { useTemplateContext } from '../hooks/useTemplateContext';
import { fetchTemplates, deleteTemplate } from '../services/templateService';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/authUtil';
import { useAuthContext } from '../hooks/useAuthContext';
import DeleteTemplateModal from './DeleteTemplateModal';

const TemplateListContainer = () => {
    const { templates, loading, error, dispatch } = useTemplateContext();
    const { user } = useAuthContext();
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [templateToDelete, setTemplateToDelete] = useState(null);

    useEffect(() => {
        const loadTemplates = async () => {
            dispatch({ type: 'SET_LOADING', payload: true });
            try {
                const token = getToken();
                const fetchedTemplates = await fetchTemplates(token);
                dispatch({ type: 'SET_TEMPLATES', payload: fetchedTemplates });
            } catch (err) {
                console.error(err);
                dispatch({
                    type: 'SET_ERROR',
                    payload: 'Failed to fetch templates. Please try again later.',
                });
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        loadTemplates();
    }, [dispatch]);

    const handleOpenModal = (template) => {
        setTemplateToDelete(template);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setTemplateToDelete(null);
        setIsModalOpen(false);
    };

    const handleDeleteTemplate = async (templateId) => {
        try {
            const token = getToken();
            await deleteTemplate(templateId, token);
            dispatch({ type: 'DELETE_TEMPLATE', payload: templateId });
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
                            <div className="mt-4 flex gap-2 ">
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
                                        onClick={() => handleOpenModal(template)}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {templateToDelete && (
                <DeleteTemplateModal
                    isOpen={isModalOpen}
                    template={templateToDelete}
                    onClose={handleCloseModal}
                    onDelete={handleDeleteTemplate}
                />
            )}
        </div>
    );
};

export default TemplateListContainer;
