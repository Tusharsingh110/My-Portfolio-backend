const axios = require('axios')

function validEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Function to check if an image URL is valid
async function isImageValid(url) {
    try {
        const response = await axios.head(url, { timeout: 5000 });
        const contentType = response.headers['content-type'];
        // Check if content-type is an image
        if (response.status === 200 && contentType.startsWith('image')) {
            return true;
        }
        return false;
    } catch (error) {
        // If there's an error (404, network error, etc.), it's not a valid image
        return false;
    }
}


async function validImages(images) {
    const validationPromises = images.map(async (imageURL) => {
        const isValid = await isImageValid(imageURL);
        return isValid ? imageURL : null
    })

    const validURLs = (await Promise.all(validationPromises)).filter(Boolean);
    return validURLs;
}

module.exports = { validEmail, validImages }
