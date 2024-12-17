import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
    {
        title: { 
            type: String, 
            required: true 
        },
        template: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Template', 
            required: true 
        },
        organization: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Organization', 
            required: true 
        },
        content: { 
            type: String, 
            required: true 
        },  // Finalized HTML with placeholders replaced by user inputs
        inputs: [ // User inputs for placeholders
            {
              key: { type: String, required: true }, // Placeholder key (e.g., {{name}})
              value: { type: String }, // User input value (e.g., "John Doe")
            },
        ],
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
    },
    {
        timestamps: true
    }
);

documentSchema.pre('save', async function (next) {
    const template = await mongoose.model('Template').findById(this.template);
    const templateKeys = template.placeholders.map(ph => ph.key);
    const inputKeys = this.inputs.map(input => input.key);

    if (!templateKeys.every(key => inputKeys.includes(key))) {
        return next(new Error('Missing inputs for some template placeholders'));
    }

    next();
});


const Document = mongoose.model('Document', documentSchema);

export default Document;
