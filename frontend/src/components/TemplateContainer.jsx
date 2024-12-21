import { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const TemplateContainer = () => {
    const [pages, setPages] = useState([{ id: 1, content: '' }]);
    const [currentPage, setCurrentPage] = useState(1);

    // Fixed DPI
    const DPI = 96; // 96 DPI (standard for most browsers)
    const pageSize = { width: DPI * 8.5, height: (DPI * 11) }; // Convert 8.5 x 11 inches to pixels

    // Shared styles for both editor and print views
    const sharedStyles = `
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .page, .mce-content-body {
            width: ${pageSize.width}px;
            min-height: ${pageSize.height - 100}px;
            max-height: ${pageSize.height - 100}px;
            padding: ${DPI}px; /* 1 inch padding at 96 DPI */
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
            size: ${pageSize.width / DPI}in ${pageSize.height / DPI}in; /* Ensure consistent inch-based size */
            margin: 1in;
        }

        @media print {
            .page, .mce-content-body {
                padding: 0;
                margin: 0 auto;
                box-shadow: none;
                border: none;
                width: ${pageSize.width}px;
                min-height: ${pageSize.height}px;
                pagebreak-after: always;
            }
        }
    `;

    const handleEditorChange = (content, editor, pageId) => {
        setPages((prevPages) =>
            prevPages.map((page) => (page.id === pageId ? { ...page, content } : page))
        );
    };

    const handleAddPage = () => {
        setPages((prevPages) => [
            ...prevPages,
            { id: prevPages.length + 1, content: '' },
        ]);
        setCurrentPage(pages.length + 1);
    };

    const handleSaveTemplate = () => {
        const combinedContent = pages.map((page) => page.content).join('<hr style="page-break-after: always;">');
        console.log('Combined Template Content:', combinedContent);
        alert('Template saved successfully!');
    };

    const handlePrintDocument = () => {
        const combinedContent = pages
            .map(
                (page) => `
                    <div class="page" style="height: ${pageSize.height}px; page-break-after: always;">
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
                                height: ${pageSize.height}px; /* Ensure each page respects height */
                                page-break-after: always; /* Always start a new page */
                            }
                            .page:last-child {
                                page-break-after: auto; /* Remove page break for last page */
                            }
                            body {
                                margin: 0;
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
            <h1 className="text-2xl font-bold mb-4">Document Editor</h1>

            {/* Pagination Controls */}
            <div className="mb-4 flex justify-between">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {pages.length}
                </span>
                <button
                    onClick={() => {
                        if (currentPage === pages.length) handleAddPage();
                        else setCurrentPage((prev) => prev + 1);
                    }}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                >
                    Next
                </button>
            </div>

            {/* Editors */}
            {pages.map((page) => (
                <div
                    key={page.id}
                    style={{ display: currentPage === page.id ? 'block' : 'none' }}
                >
                    <Editor
                        apiKey="0u9umuem86bbky3tbhbd94u9ebh6ocdmhar9om8kgfqiffmz" // Preserved API Key
                        value={page.content}
                        init={{
                            height: pageSize.height, // Lock height based on page size (pixels)
                            menubar: 'favs file edit view insert format tools table help',
                            plugins: [
                                'advlist', 'autolink', 'link', 'image', 'lists', 'pagebreak', 'charmap', 'preview', 'anchor',
                                'searchreplace', 'wordcount', 'visualblocks', 'code', 'fullscreen', 'insertdatetime',
                                'media', 'table', 'emoticons', 'help', 'print',
                            ],
                            toolbar: 'undo redo | styles | bold italic underline | fontsize fontfamily | lineheight pagebreak| ' +
                                'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | ' +
                                'link image | fullscreen | forecolor backcolor emoticons | help',
                            fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
                            line_height_formats: '1 1.1 1.15 1.2 1.3 1.5 2',                       
                            content_style: sharedStyles, // Apply shared styles
                        }}
                        onEditorChange={(content, editor) => handleEditorChange(content, editor, page.id)}
                    />
                </div>
            ))}

            <div className="mt-4 flex gap-4">
                <button
                    onClick={handleSaveTemplate}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    Save Document
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

export default TemplateContainer;
