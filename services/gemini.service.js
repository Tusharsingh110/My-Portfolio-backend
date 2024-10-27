require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { validImages } = require('../validators/validator');

const fetchImageLinkGemini = async (technology) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `just provide working images CDN linka for the ${technology} logo in SVG format. The response is to be an array of links: containing links in svg format seperated by commas. keep the response in raw format. do not add /n or other formatting just pure javascript array.take some time and try to find legitimate results, try to include https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ results if there are any. only provide the link if it is working SVG or PNG link`;

        const result = await model.generateContent(prompt);
        let geminiData = result.response.text();

        const filterItems = ['\"', '\n', '[', ']'];
        filterItems.forEach(item => { geminiData = geminiData.replaceAll(item, '') });

        geminiData = geminiData.split(', ');

        const validImageURLs = await validImages(geminiData);

        return { valid: true, message: "Gemini response fetched successfully.", data: validImageURLs };

    } catch (error) {
        console.error('Error fetching image link:', error.response ? error.response.data : error.message);
        return { valid: false, message: "Gemini response fetch failed.", error: error.response ? error.response.data : error.message };
    }
}

module.exports = {
    fetchImageLinkGemini: fetchImageLinkGemini
}
