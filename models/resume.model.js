const mongoose = require('mongoose');
const { Schema } = mongoose;

const ResumeSchema = new Schema({
    version: {
        type: Number,
        required: true,
        default: 1 // Default version for new resumes
    },
    file: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                // Basic validation to ensure it's base64 (adjust regex as needed)
                return /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(v);
            },
            message: props => `${props.value} is not a valid base64 string!`
        }
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt
});

const Resume = mongoose.model("Resume", ResumeSchema);

module.exports = Resume;
