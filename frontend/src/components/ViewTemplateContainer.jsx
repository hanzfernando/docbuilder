import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { getToken } from '../utils/authUtil.js';
import { getTemplateById } from '../services/templateService.js';

const ViewTemplateContainer = () => {
    const { id } = useParams(); // Fetch ID from the URL if available
    const [pages, setPages] = useState([{ id: 1, content: '' }]);
    const [currentPage, setCurrentPage] = useState(1);
    const [documentName, setDocumentName] = useState('');
    const [documentType, setDocumentType] = useState('');
    const [documentSubtype, setDocumentSubtype] = useState('');
    const [requiredRole, setRequiredRole] = useState('student');
    const [paperSize, setPaperSize] = useState('letter');

    const DPI = 96; // Fixed DPI for page dimensions
    const pageSizes = {
        letter: { width: DPI * 8.5, height: DPI * 11 },
        legal: { width: DPI * 8.5, height: DPI * 14 },
        a4: { width: DPI * 8.27, height: DPI * 11.69 },
    };

    const selectedPageSize = pageSizes[paperSize];

    const sharedStyles = `
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }

        .page, .mce-content-body {
            width: ${selectedPageSize.width}px;
            min-height: ${selectedPageSize.height - 100}px;
            max-height: ${selectedPageSize.height - 100}px;
            padding: ${DPI}px;
            margin: 2.6rem auto;
            background-color: white;
            border: 1px solid #ddd;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            font-size: 12pt;
            line-height: 1.15;
        }

        .mce-content-body p {
            margin: 0;
            margin-bottom: 8pt;
        }

        @page {
            size: ${selectedPageSize.width / DPI}in ${selectedPageSize.height / DPI}in;
            margin: 1in 1in 0in 1in;
        }

        @media print {
            .page, .mce-content-body {
                overflow-wrap: break-word;
                padding: 0;
                margin: 0 auto;
                box-shadow: none;
                border: none;
                width: ${selectedPageSize.width}px;
                min-height: ${selectedPageSize.height}px;
                pagebreak-after: always;
            }
        }
    `;

    useEffect(() => {
        if (id) {
            const loadTemplate = async () => {
                try {
                    const token = getToken();
                    const templateData = await getTemplateById(id, token);
                    setDocumentName(templateData.name);
                    setDocumentType(templateData.type);
                    setDocumentSubtype(templateData.subtype || '');
                    setRequiredRole(templateData.requiredRole);
                    setPaperSize(templateData.paperSize);
                    setPages(
                        templateData.content.split('<hr style="page-break-after: always;">').map((content, index) => ({
                            id: index + 1,
                            content,
                        }))
                    );
                } catch (error) {
                    console.error('Error loading template:', error.message);
                    alert('Failed to load template. Please try again.');
                }
            };
            loadTemplate();
        }
    }, [id]);

    const handleNextPage = () => {
        if (currentPage < pages.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{documentName}</h1>
            <div className="mb-4 border p-4 rounded shadow">
                <h2 className="text-xl font-medium mb-4">Template Information</h2>
                <p className="mb-2">
                    <strong>Type:</strong> {documentType}
                </p>
                <p className="mb-2">
                    <strong>Subtype:</strong> {documentSubtype || 'N/A'}
                </p>
                <p className="mb-2">
                    <strong>Role:</strong> {requiredRole}
                </p>
                <p className="mb-2">
                    <strong>Paper Size:</strong> {paperSize}
                </p>
            </div>

            {/* Pagination Controls */}
            <div className="mb-4 flex justify-between">
                <button
                    disabled={currentPage === 1}
                    onClick={handlePreviousPage}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 disabled:opacity-50"
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {pages.length}
                </span>
                <button
                    disabled={currentPage === pages.length}
                    onClick={handleNextPage}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {/* Editor */}
            {pages.map((page) => (
                <div key={page.id} style={{ display: currentPage === page.id ? 'block' : 'none' }}>
                    <Editor
                        apiKey="0u9umuem86bbky3tbhbd94u9ebh6ocdmhar9om8kgfqiffmz"
                        value={page.content}
                        init={{
                            height: selectedPageSize.height,
                            menubar: false,
                            toolbar: false,
                            readonly: true,
                            content_style: sharedStyles,
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

export default ViewTemplateContainer;
