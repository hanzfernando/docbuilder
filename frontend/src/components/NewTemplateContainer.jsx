import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const PAGE_HEIGHT_THRESHOLD = 1056; // For example, 11in at 96 dpi (adjust as needed)

const TemplateEditor = () => {
  const editorRef = useRef(null);

  // When a key is released, check the last page.
  // If its content exceeds our threshold, append a new page.
  const handleEditorKeyUp = (editor) => {
    const body = editor.getBody();
    // Find the last page container
    const lastPage = body.querySelector('.page:last-of-type');
    if (lastPage && lastPage.scrollHeight > PAGE_HEIGHT_THRESHOLD) {
      // If there isn’t already a following page container, add one.
      if (
        !lastPage.nextElementSibling ||
        !lastPage.nextElementSibling.classList.contains('page')
      ) {
        const newPage = document.createElement('div');
        newPage.className = 'page';
        // Add a blank paragraph so the user can click and type
        newPage.innerHTML = '<p><br/></p>';
        body.appendChild(newPage);

        // Optionally, move the caret to the new page.
        editor.focus();
        editor.selection.select(newPage, true);
        editor.selection.collapse(true);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Template Editor</h1>
      <Editor
        // Replace with your TinyMCE API key if needed
        apiKey="YOUR_TINYMCE_API_KEY"
        onInit={(evt, editor) => (editorRef.current = editor)}
        // Start with a single page container
        initialValue='<div class="page"><p>Start typing your document here...</p></div>'
        init={{
          height: 800, // Visible editor height (adjust as needed)
          menubar: true,
          plugins: 'lists link image pagebreak advlist autolink', // Add any additional plugins as required
          toolbar:
            'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent | pagebreak | addImage',
          
          content_style: `
            body {
              background-color: #f7fafc; /* Tailwind gray-100 */
              padding: 1rem;
              margin: 0;
            }
            .page {
              width: 8.5in;
              min-height: 11in;
              margin: 1rem auto;
              background: white;
              padding: 1in;
              box-shadow: 0 0 0.5in rgba(0, 0, 0, 0.1);
              position: relative;
              box-sizing: border-box;
            }
            .page p {
              margin: 0;
              margin-bottom: 8pt;
            }
          `,
          setup: (editor) => {
            // Listen for keyup events to trigger auto-pagination.
            editor.on('keyup', () => {
              handleEditorKeyUp(editor);
            });

            // You can add additional custom button registrations or event handlers here.
            // For example, you might add image uploads, draggable elements, etc.
          },
        }}
      />
    </div>
  );
};

export default TemplateEditor;
