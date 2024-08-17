const Resume = require("../models/resume.model");

const saveResume = async (req, res) => {
    try {
        const { version, description } = req.body;
        const file = req.file;
        if (!file || !description || !version) {
            return res.status(400).json({ statusCode: 400, message: `Incomplete Data` });
        }
        let versionMatch = await Resume.findOne({ version });
        if (versionMatch) {
            return res.status(400).json({ statusCode: 400, message: `Resume_${version} already exists.` });
        }
        const base64File = file.buffer.toString('base64');
        const newResume = new Resume({
            version,
            file: base64File,
            description
        });

        const response = await newResume.save();

        return res.status(201).json({ statusCode: 201, message: `Resume_${version} uploaded successfully` });

    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Internal Server Error", error: error });
    }
}


const getAllResumeVersions = async (req, res) => {
    try {
        const allResumes = await Resume.find({}, { file: 0 })
        return res.status(200).json({ statusCode: 200, data: allResumes, message: "Resume Versions fetched successfully" })
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
    }
}

const fetchResume = async (req, res) => {
    try {
        const {version} = req.params;
        console.log(version);
        const resume = await Resume.findOne({version});
        if(!resume) {
            return res.status(404).json({statusCode:404, message: "Resume not found"});
        }
        res.status(200).json({statusCode:200, data: resume, message:"Resume fetched succesfully"})
    } catch (error) {
        return res.status(500).json({ statusCode: 500, error:error,  message: "Internal Server Error" });
    }
}

module.exports = {
    getAllResumeVersions,
    fetchResume,
    saveResume
}