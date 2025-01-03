import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { getToken } from '../utils/authUtil.js';
import { createTemplate, getTemplateById, updateTemplate } from '../services/templateService.js';

const TemplateContainer = () => {
    const { id } = useParams(); // Fetch ID from the URL if available
    const [pages, setPages] = useState([{ id: 1, content: '' }]);
    const [currentPage, setCurrentPage] = useState(1);
    const [documentName, setDocumentName] = useState('');
    const [documentType, setDocumentType] = useState('');
    const [documentSubtype, setDocumentSubtype] = useState('');
    const [requiredRole, setRequiredRole] = useState('student');
    const [paperSize, setPaperSize] = useState('letter');
    const [strictMode, setStrictMode] = useState(false); // Strict mode toggle
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const navigate = useNavigate();

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

        .non-editable {
            
        }

        .editable {
            background-color: #fffbe6;
            border: 1px dashed #ffa000;
            padding: 2px;
        }

        .editable:hover {
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
                    setPaperSize(templateData.paperSize); // Lock paper size for updates
                    setPages(
                        templateData.content.split('<hr style="page-break-after: always;">').map((content, index) => ({
                            id: index + 1,
                            content,
                        }))
                    );
                    setIsUpdateMode(true);
                    setEditorLoaded(true);
                } catch (error) {
                    console.error('Error loading template:', error.message);
                    alert('Failed to load template. Please try again.');
                }
            };
            loadTemplate();
        }
    }, [id]);

    const handleEditorChange = (content, editor, pageId) => {
        const updatedContent = strictMode
            ? content.includes('class="non-editable"')
                ? content // Avoid re-wrapping if already wrapped
                : `<div class="non-editable">${content}</div>`
            : content;

        setPages((prevPages) =>
            prevPages.map((page) =>
                page.id === pageId ? { ...page, content: updatedContent } : page
            )
        );
    };

    const toggleStrictMode = () => setStrictMode(!strictMode);

    const handleAddPage = () => {
        setPages((prevPages) => [
            ...prevPages,
            { id: prevPages.length + 1, content: '' },
        ]);
        setCurrentPage(pages.length + 1);
    };

    const handleDeletePage = () => {
        if (pages.length > 1) {
            const confirmed = window.confirm("Are you sure you want to delete this page?");
            if (confirmed) {
                const newPages = pages.filter((page) => page.id !== currentPage);
                setPages(newPages);
                setCurrentPage((prev) =>
                    prev > newPages.length ? newPages.length : prev
                );
            }
        } else {
            alert("You cannot delete the last page!");
        }
    };

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

    const handleSaveOrUpdateTemplate = async () => {
        if (!documentName || !documentType || !requiredRole || pages.length === 0) {
            alert('Please fill in all required fields and ensure there is content.');
            return;
        }

        const combinedContent = pages.map((page) => page.content).join('<hr style="page-break-after: always;">');

        const templateData = {
            name: documentName,
            content: combinedContent,
            type: documentType,
            subtype: documentSubtype,
            requiredRole,
            paperSize
        };

        try {
            const token = getToken();
            if (isUpdateMode) {
                await updateTemplate(id, templateData, token);
                alert('Template updated successfully!');
            } else {
                await createTemplate(templateData, token);
                alert('Template created successfully!');
            }
            navigate('/templates'); // Navigate back to templates page
        } catch (error) {
            console.error('Error saving/updating template:', error.message);
            alert('Failed to save/update template. Please try again.');
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
            <h1 className="text-2xl font-bold mb-4">Template Editor</h1>
            {/* Document Details */}
            <div className="mb-4 border p-4 rounded shadow">
                <h2 className="text-xl font-medium mb-4">Template Information</h2>
                <label className="block text-gray-700 font-medium mb-2">Template Name:</label>
                <input
                    type="text"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    placeholder="Enter document name"
                    className="w-full border rounded p-2 mb-4"
                    required
                    disabled={editorLoaded} // Lock field once template creation begins
                />
                <label className="block text-gray-700 font-medium mb-2">Document Type:</label>
                <input
                    type="text"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    placeholder="Enter document type (e.g., Proposal, Report)"
                    className="w-full border rounded p-2 mb-4"
                    required
                    disabled={editorLoaded} // Lock field once template creation begins
                />
                <label className="block text-gray-700 font-medium mb-2">Document Subtype:</label>
                <input
                    type="text"
                    value={documentSubtype}
                    onChange={(e) => setDocumentSubtype(e.target.value)}
                    placeholder="Enter document subtype (optional)"
                    className="w-full border rounded p-2 mb-4"
                    disabled={editorLoaded} // Lock field once template creation begins
                />
                <label className="block text-gray-700 font-medium mb-2">Template For:</label>
                <select
                    value={requiredRole}
                    onChange={(e) => setRequiredRole(e.target.value)}
                    className="border rounded p-2 mb-4"
                    required
                    disabled={editorLoaded} // Lock field once template creation begins
                >
                    <option value="">Select Role</option>
                    <option value="student">Student</option>
                    <option value="organization">Organization</option>
                </select>
                <label className="block text-gray-700 font-medium mb-2">Strict Mode:</label>
                <input
                    type="checkbox"
                    checked={strictMode}
                    onChange={toggleStrictMode}
                    className="mr-2"
                    disabled={editorLoaded} // Lock toggle once template creation begins
                />
                Enable strict mode
                <label className="block text-gray-700 font-medium mb-2">Paper Size:</label>
                <select
                    value={paperSize}
                    onChange={(e) => setPaperSize(e.target.value)}
                    disabled={editorLoaded} // Lock field once template creation begins
                    className="border rounded p-2 mb-4"
                    required
                >
                    <option value="letter">Letter (8.5in x 11in)</option>
                    <option value="legal">Legal (8.5in x 14in)</option>
                    <option value="a4">A4 (8.27in x 11.69in)</option>
                </select>

                <button
                    onClick={() => {
                        // Validate all required fields before starting template creation
                        if (!documentName || !documentType || !requiredRole || !paperSize) {
                            alert('Please fill in all required fields before starting template creation.');
                            return;
                        }
                        setEditorLoaded(true); // Allow template creation to begin
                    }}
                    disabled={editorLoaded} // Prevent multiple clicks
                    className={`bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 ${
                        editorLoaded ? 'hidden' : ''
                    }`}
                >
                    Begin Template Creation
                </button>
            </div>


            {editorLoaded && (
                <>
                    {/* Pagination Controls */}
                    <div className="mb-4 flex justify-between">
                        <button
                            disabled={currentPage === 1}
                            onClick={handlePreviousPage}
                            className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {pages.length}
                        </span>
                        <button
                            disabled={currentPage === pages.length}
                            onClick={handleNextPage}
                            className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                        >
                            Next
                        </button>
                    </div>

                    {/* Add/Delete Buttons */}
                    <div className="mb-4 flex justify-end gap-4">
                        <button
                            onClick={handleAddPage}
                            disabled={isUpdateMode}
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                        >
                            Add Page
                        </button>
                        <button
                            onClick={handleDeletePage}
                            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                        >
                            Delete Page
                        </button>
                    </div>

                    {/* Editors */}
                    {pages.map((page) => (
                        <div
                            key={page.id}
                            style={{ display: currentPage === page.id ? 'block' : 'none' }}
                        >
                            <Editor
                                apiKey="0u9umuem86bbky3tbhbd94u9ebh6ocdmhar9om8kgfqiffmz"
                                value={page.content}
                                init={{
                                    height: selectedPageSize.height,
                                    menubar: 'favs file edit view insert format tools table help',
                                    plugins: [
                                        'advlist', 'autolink', 'link', 'image', 'lists', 'pagebreak', 'charmap', 'preview', 'anchor',
                                        'searchreplace', 'wordcount', 'visualblocks', 'code', 'fullscreen', 'insertdatetime',
                                        'media', 'table', 'emoticons', 'help', 'print',
                                    ],
                                    toolbar:
                                        'undo redo | styles | bold italic underline | fontsize fontfamily | markEditable removeEditable | lineheight pagebreak| ' +
                                        'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | addHangingIndent removeHangingIndent | ' +
                                        'link image | fullscreen | forecolor backcolor emoticons | help',
                                    fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
                                    line_height_formats: '1 1.1 1.15 1.2 1.3 1.5 2',
                                    content_style: sharedStyles,
                                    setup: (editor) => {
                                        editor.ui.registry.addButton('markEditable', {
                                            text: 'Mark Editable',
                                            onAction: () => {
                                                const content = editor.selection.getContent();
                                                editor.selection.setContent(`<span class="editable">${content}</span>`);
                                            },
                                        });
            
                                        editor.ui.registry.addButton('removeEditable', {
                                            text: 'Remove Editable',
                                            onAction: () => {
                                                const content = editor.selection.getContent();
                                                editor.selection.setContent(content.replace(/<span class="editable">(.*?)<\/span>/g, '$1'));
                                            },
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
                                onEditorChange={(content, editor) => handleEditorChange(content, editor, page.id)}
                            />
                        </div>
                    ))}

                    <div className="mt-4 flex gap-4">
                        <button
                            onClick={handleSaveOrUpdateTemplate}
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                        >
                            {isUpdateMode ? 'Update Template' : 'Save Template'}
                        </button>
                        <button
                            onClick={handlePrintDocument}
                            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
                        >
                            Print Document
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TemplateContainer;
