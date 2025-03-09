const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatContextDefinition = new Schema({
    personalInfo: {
        name: { 
            type: String, 
            required: true 
        },
        location: {
            city: String,
            state: String,
            country: String
        },
        contact: {
            phone: String,
            email: String,
            socialProfiles: {
                linkedin: String,
                github: String
            }
        }
    },
    education: {
        undergraduate: {
            institution: String,
            degree: String,
            cgpa: Number,
            duration: {
                start: String,
                end: String
            }
        },
        highSchool: {
            institution: String,
            percentage: Number,
            duration: {
                start: String,
                end: String
            }
        },
        relevantCoursework: [String]
    },
    experience: [{
        company: String,
        position: String,
        duration: {
            start: String,
            end: String
        },
        responsibilities: [String]
    }],
    projects: [{
        name: String,
        technologies: [String],
        description: String
    }],
    technicalSkills: {
        languages: [String],
        frameworks: [String],
        tools: [String]
    },
    achievements: [{
        title: String,
        description: String
    }],
    leadership: {
        organization: String,
        position: String,
        achievements: [String]
    }
}, {
    timestamps: true
});

const ChatContextSchemaModel = mongoose.model('chatbotContext', chatContextDefinition);

module.exports = ChatContextSchemaModel;