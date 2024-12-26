import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { getDocumentsByUser } from '../services/documentService';
import { useDocumentContext } from '../hooks/useDocumentContext'; // Create this hook if not already available
import { getToken } from '../utils/authUtil';

const DocumentListContainer = () => {
    const { documents, loading, error, dispatch } = useDocumentContext();
    const { user } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        const loadDocuments = async () => {
            dispatch({ type: 'SET_LOADING', payload: true });
            try {
                const token = getToken();
                const fetchedDocuments = await getDocumentsByUser(user._id, token); // Replace with your actual API call
                dispatch({ type: 'SET_DOCUMENTS', payload: fetchedDocuments });
            } catch (err) {
                console.error(err);
                dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch documents. Please try again later.' });
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        loadDocuments();
    }, [dispatch, user]);

    if (loading) return <p>Loading documents...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Your Documents</h2>
            {documents.length === 0 ? (
                <p>No documents available. Create your first document!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documents.map((document) => (
                        <div
                            key={document._id}
                            className="border rounded p-4 shadow hover:shadow-lg transition-shadow duration-300"
                        >
                            <h3 className="text-xl font-semibold mb-2">{document.title}</h3>
                            <p className="text-gray-700 mb-1">
                                <strong>Template:</strong> {document.template.name || 'N/A'}
                            </p>
                            {/* <p className="text-gray-700">
                                <strong>Created By:</strong> {user.name}
                            </p> */}
                            <div className="mt-4 flex gap-2">
                                <button
                                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                                    onClick={() => navigate(`/documents/${document._id}`)} // Navigate to view/edit document
                                >
                                    Open
                                </button>                        
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DocumentListContainer;
