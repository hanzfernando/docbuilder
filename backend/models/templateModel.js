import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true 
        },
        content: { 
            type: String, 
            required: true 
        },  // This can store HTML content, or you can serialize a WYSIWYG format
        placeholders: [ // Placeholder definitions with assigned questions
            {
              key: { type: String, required: true }, // Placeholder key (e.g., {{name}})
              question: { type: String, required: true }, // Question to display for this placeholder
            },
          ],
        requiredRole: { 
            type: String, 
            enum: ['faculty', 'registrar', 'student'],
            required: true
        },
        organization: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Organization', 
            required: true 
        },
    },
    {
        timestamps: true
    }
);

// Add an index for the `requiredRole` field
templateSchema.index({ organization: 1, requiredRole: 1 });

const Template = mongoose.model('Template', templateSchema);

export default Template;
