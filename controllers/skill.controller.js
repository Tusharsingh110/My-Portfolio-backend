const Skill = require('../models/skills.model');

const getSkills = async (req, res) => {
    try {
        const skills = await Skill.find({});

        if (!skills) {
            return res.status(500).json({ statusCode: 500, message: "Skills fetch failure." });
        }

        return res.status(200).json({ statusCode: 200, message: "Skills fetched successfully.", data: skills });
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Internal Server Error.", error: error });
    }
}

const deleteSkillById = async (req, res) => {
    try {
        const id = req.body.id;

        const skill = await Skill.findOne({ id: id });

        if (!skill) {
            return res.status(404).json({ statusCode: 404, message: "Bad Request! skill not found." });
        }

        const deleteRes = await Skill.deleteOne({ id: id });
        
        if (!deleteRes) {
            return res.status(500).json({ statusCode: 500, message: "Could not delete skill." });
        }

        return res.status(200).json({ statusCode: 200, message: "Skill deleted successfully." });
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Internal Server Error." });
    }
}

module.exports = {
    getSkills: getSkills,
    deleteSkillById: deleteSkillById
}