import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { getToken } from '../utils/authUtil';
import { createDocument, updateDocument, getDocumentById } from '../services/documentService';
import { getTemplateById } from '../services/templateService';

const DocumentContainer = () => {
    const { id, templateId } = useParams(); // `id` for the document and `templateId` for creating based on a template
    const [pages, setPages] = useState([{ id: 1, content: '' }]);
    const [currentPage, setCurrentPage] = useState(1);
    const [title, setTitle] = useState('');
    const [template, setTemplate] = useState(null);
    // const [content, setContent] = useState('');
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const navigate = useNavigate();

    const DPI = 96; // Fixed DPI for page dimensions
    const pageSizes = {
        letter: { width: DPI * 8.5, height: DPI * 11 },
        legal: { width: DPI * 8.5, height: DPI * 14 },
        a4: { width: DPI * 8.27, height: DPI * 11.69 },
    };

    const selectedPageSize = pageSizes.letter;

    const sharedStyles = `
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }

        .non-editable {
            pointer-events: none;
            user-select: none;
        }

        .non-editable .editable {
            pointer-events: auto;
            user-select: auto;
            background-color: #fffbe6;
            border: 1px dashed #ffa000;
            padding: 2px;
        }

        .non-editable .editable:hover {
            border-color: #ff6f00;
            background-color: #fff3e0;
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

            .non-editable, .non-editable .editable {
                background-color: transparent;
                border: none;
            }
        }
    `;

    useEffect(() => {
        const loadDocumentOrTemplate = async () => {
            if (id) {
                // If editing an existing document
                try {
                    const token = getToken();
                    const documentData = await getDocumentById(id, token);
                    setTitle(documentData.title);
                    setTemplate(documentData.template);
                    setPages(
                        documentData.content.split('<hr style="page-break-after: always;">').map((content, index) => ({
                            id: index + 1,
                            content,
                        }))
                    );
                    setIsUpdateMode(true);
                } catch (error) {
                    console.error('Error loading document:', error.message);
                    alert('Failed to load document. Please try again.');
                }
            } else 
            if (templateId) {
                // If creating a new document from a template
                try {
                    const token = getToken();
                    const templateData = await getTemplateById(templateId, token);
                    setTemplate(templateData);
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
            }
        };

        loadDocumentOrTemplate();
    }, [id, templateId]);

    const handleEditorChange = (content, pageId) => {
        setPages((prevPages) =>
            prevPages.map((page) => (page.id === pageId ? { ...page, content } : page))
        );
    };

    // const handleAddPage = () => {
    //     setPages((prevPages) => [
    //         ...prevPages,
    //         { id: prevPages.length + 1, content: '' },
    //     ]);
    //     setCurrentPage(pages.length + 1);
    // };

    // const handleDeletePage = () => {
    //     if (pages.length > 1) {
    //         const confirmed = window.confirm('Are you sure you want to delete this page?');
    //         if (confirmed) {
    //             const newPages = pages.filter((page) => page.id !== currentPage);
    //             setPages(newPages);
    //             setCurrentPage((prev) => (prev > newPages.length ? newPages.length : prev));
    //         }
    //     } else {
    //         alert('You cannot delete the last page!');
    //     }
    // };

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

    const handleSaveOrUpdateDocument = async () => {
        if (!title || pages.length === 0) {
            alert('Please fill in all required fields and ensure there is content.');
            return;
        }

        const combinedContent = pages.map((page) => page.content).join('<hr style="page-break-after: always;">');

        const documentData = {
            title,
            template: template?._id,
            content: combinedContent,
        };

        try {
            const token = getToken();
            if (isUpdateMode) {
                await updateDocument(id, documentData, token);
                alert('Document updated successfully!');
            } else {
                await createDocument(documentData, token);
                alert('Document created successfully!');
            }
            navigate('/documents'); // Redirect after save/update
        } catch (error) {
            console.error('Error saving/updating document:', error.message);
            alert('Failed to save/update document. Please try again.');
        }
    };

    const handlePrintDocument = () => {
        const combinedContent = pages
            .map(
                (page) => `
                    <div class="page" style="height: ${selectedPageSize.height}px; page-break-after: always;">
                        ${page.content}
                    </div>
                `
            )
            .join('');

        const printWindow = window.open('', '_blank', 'width=800,height=600');
        printWindow.document.open();
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Document</title>
                    <style>
                        ${sharedStyles}
                        @media print {
                            .page {                 
                                height: ${selectedPageSize.height}px;
                                page-break-after: always;
                            }
                            .page:last-child {
                                page-break-after: auto;
                            }
                            body {
                                margin: 0; 
                                padding: 0; 
                                box-shadow: none;
                            }
                            .page {
                                margin: 0 auto; 
                                padding: 0; 
                            }
                        }
                    </style>
                </head>
                <body>${combinedContent}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{isUpdateMode ? 'Edit Document' : 'Create New Document'}</h1>
            <div className="mb-4 border p-4 rounded shadow">
                <h2 className="text-xl font-medium mb-4">Document Information</h2>
                <label className="block text-gray-700 font-medium mb-2">Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter document title"
                    className="w-full border rounded p-2 mb-4"
                />
                {template && (
                    <p className="text-gray-700 mb-4">
                        <strong>Template:</strong> {template.name}
                    </p>
                )}
            </div>

            <div className="mb-4">
                <div className="flex justify-between mb-4">
                    <button
                        disabled={currentPage === 1}
                        onClick={handlePreviousPage}
                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {pages.length}</span>
                    <button
                        disabled={currentPage === pages.length}
                        onClick={handleNextPage}
                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                    >
                        Next
                    </button>
                </div>
                {pages.map((page) => (
                    <div key={page.id} style={{ display: currentPage === page.id ? 'block' : 'none' }}>
                        <Editor
                            apiKey="0u9umuem86bbky3tbhbd94u9ebh6ocdmhar9om8kgfqiffmz"
                            value={page.content}
                            init={{
                                height: selectedPageSize.height,
                                menubar: true,
                                plugins: [
                                    'advlist autolink lists link image charmap print preview anchor',
                                    'searchreplace visualblocks code fullscreen',
                                    'insertdatetime media table paste code help wordcount',
                                ],
                                toolbar:
                                    'undo redo | formatselect | bold italic backcolor | ' +
                                    'alignleft aligncenter alignright alignjustify | ' +
                                    'bullist numlist outdent indent | addHangingIndent removeHangingIndent | removeformat | help',
                                content_style: sharedStyles,
                                readonly: 1,
                                browser_spellcheck: true,
                                setup: (editor) => {
                                    // Prevent interaction outside of editable spans within non-editable blocks
                                    editor.on('BeforeExecCommand', (e) => {
                                        const selectedNode = editor.selection.getNode();
                                        if (selectedNode.closest('.non-editable') && !selectedNode.classList.contains('editable')) {
                                            e.preventDefault(); // Block commands like typing or formatting
                                        }
                                    });

                                    // Prevent cursor placement or interaction outside of editable spans
                                    editor.on('MouseDown', (e) => {
                                        const targetNode = e.target;
                                        if (targetNode.closest('.non-editable') && !targetNode.classList.contains('editable')) {
                                            e.preventDefault(); // Prevent clicking into non-editable areas
                                            editor.selection.collapse(); // Remove selection
                                        }
                                    });

                                    // Ensure `editable` spans remain editable
                                    editor.on('BeforeSetContent', (e) => {
                                        const parser = new DOMParser();
                                        const doc = parser.parseFromString(e.content, 'text/html');
                                        const nonEditableElements = doc.querySelectorAll('.non-editable');
                                        nonEditableElements.forEach((el) => {
                                            // Set non-editable container to not allow interaction
                                            el.setAttribute('contenteditable', 'false');

                                            // Ensure editable spans inside remain editable
                                            el.querySelectorAll('.editable').forEach((span) => {
                                                span.setAttribute('contenteditable', 'true');
                                            });
                                        });
                                        e.content = doc.body.innerHTML;
                                    });

                                    // Adjust toolbar interaction based on selection
                                    editor.on('NodeChange', () => {
                                        const selectedNode = editor.selection.getNode();
                                        const inNonEditable = selectedNode.closest('.non-editable') && !selectedNode.classList.contains('editable');
                                        const toolbarButtons = editor.getContainer().querySelectorAll('.tox-tbtn');

                                        toolbarButtons.forEach((btn) => {
                                            btn.disabled = inNonEditable; // Disable buttons if in a non-editable area
                                        });
                                    });
                                    // Add Hanging Indent Button
                                    editor.ui.registry.addButton('addHangingIndent', {
                                        text: 'Hanging Indent',
                                        icon: 'indent',
                                        tooltip: 'Add Hanging Indent',
                                        onAction: () => {
                                            const selectedNode = editor.selection.getNode(); // Get the selected node
                                            const isParagraph = selectedNode.nodeName === 'P'; // Check if it's a <p> element
                                
                                            if (isParagraph) {
                                                // Update the style directly for <p> elements
                                                selectedNode.style.textIndent = '-40px';
                                                selectedNode.style.marginLeft = '40px';
                                            } else {
                                                // Wrap in a <p> if not already a block element
                                                const content = editor.selection.getContent({ format: 'html' });
                                                editor.selection.setContent(
                                                    `<p style="text-indent: -40px; margin-left: 40px;">${content}</p>`
                                                );
                                            }
                                        },
                                    });
                                
                                    // Remove Hanging Indent Button
                                    editor.ui.registry.addButton('removeHangingIndent', {
                                        text: 'Remove Hanging Indent',
                                        icon: 'outdent',
                                        tooltip: 'Remove Hanging Indent',
                                        onAction: () => {
                                            const selectedNode = editor.selection.getNode(); // Get the selected node
                                            const isParagraph = selectedNode.nodeName === 'P'; // Check if it's a <p> element
                                
                                            if (isParagraph) {
                                                // Remove the hanging indent styles
                                                selectedNode.style.textIndent = '';
                                                selectedNode.style.marginLeft = '';
                                            } else {
                                                // Handle nested <p> tags (if any)
                                                const content = editor.selection.getContent({ format: 'html' });
                                                editor.selection.setContent(
                                                    content.replace(/<p[^>]*style=["'][^"']*text-indent:\s*-40px;?\s*margin-left:\s*40px;?[^"']*["'][^>]*>(.*?)<\/p>/g, '$1')
                                                );
                                            }
                                        },
                                    });
                                },                                                 
                            }}
                            onEditorChange={(content) => handleEditorChange(content, page.id)}
                        />
                    </div>
                ))}
            </div>

            <div className="mt-4 flex gap-4">
                <button
                    onClick={handleSaveOrUpdateDocument}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    {isUpdateMode ? 'Update Document' : 'Save Document'}
                </button>
                <button
                    onClick={() => navigate('/documents')}
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
                >
                    Cancel
                </button>
                <button
                    onClick={handlePrintDocument}
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
                >
                    Print Document
                </button>
            </div>
        </div>
    );
};

export default DocumentContainer;
