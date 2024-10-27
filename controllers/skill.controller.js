const Skill = require('../models/skills.model');
const { fetchImageLinkGemini } = require('../services/gemini.service');

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

        const skill = await Skill.findById({ _id: id });

        if (!skill) {
            return res.status(404).json({ statusCode: 404, message: "Bad Request! skill not found." });
        }

        const deleteRes = await Skill.deleteOne({ _id: id });

        if (!deleteRes) {
            return res.status(500).json({ statusCode: 500, message: "Could not delete skill." });
        }
        return res.status(200).json({ statusCode: 200, message: "Skill deleted successfully." });
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Internal Server Error." });
    }
}

const fetchSkillImages = async (req, res) => {
    try {
        const skill = req.body.skill;

        const geminiImageResponse = await fetchImageLinkGemini(skill);

        if (!geminiImageResponse.valid) {
            return res.status(400).json({ statusCode: 400, message: geminiImageResponse.message, error: geminiImageResponse.error });
        }
        return res.status(200).json({ statusCode: 200, message: "Skill Images fetch success.", data: geminiImageResponse.data });
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Internal Server Error", error: error });
    }
}

const addSkill = async (req, res) => {
    try {
        const {skillName, skillImgSrc} = req.body;

        if(!skillName || !skillImgSrc) {
            return res.status(400).json({statusCode:400, message:"Bad Request, parameters missing."});
        }

        const newSkill = new Skill({
            label: skillName,
            imgsrc: skillImgSrc
        });
        const saveSkillResponse = await newSkill.save();

        if(!saveSkillResponse) {
            return res.status(500).json({statusCode:500, message:"Skill save Failed."});
        }
        return res.status(200).json({ statusCode: 200, message: "Skill added successfully.", data: saveSkillResponse });
    } catch (error) {
        return res.status(500).json({statusCode:500, message:"Internal server error.", error});
    }
}

module.exports = {
    getSkills: getSkills,
    deleteSkillById: deleteSkillById,
    addSkill: addSkill,
    fetchSkillImages: fetchSkillImages
}