const mongoose = require('mongoose');
const {Schema} = mongoose;

const SkillSchema = new Schema({
    label: {
        type: String,
        required: true,
        default: null
    },
    imgsrc: {
        type: String,
        required: true,
        default: null
    }
});

const Skill = mongoose.model('Skill',SkillSchema);
module.exports = Skill;