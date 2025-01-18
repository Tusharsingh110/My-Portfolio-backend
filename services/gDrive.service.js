const { google } = require('googleApis');
const axios = require('axios');




// Update File G-DRIVE API

const updateFileByFileId = async (fileId, fileData) => {
	const serviceAccountCredentials = {
		type: process.env.GOOGLE_TYPE,
		project_id: process.env.GOOGLE_PROJECT_ID,
		private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
		private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
		client_email: process.env.GOOGLE_CLIENT_EMAIL,
		client_id: process.env.GOOGLE_CLIENT_ID,
		auth_uri: process.env.GOOGLE_AUTH_URI,
		token_uri: process.env.GOOGLE_TOKEN_URI,
		auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
		client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
		universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN
	};

	const auth = new google.auth.GoogleAuth({
		keyFile: serviceAccountCredentials,
		scopes: ['https://www.googleapis.com/auth/drive'],
	});
	try {
		// Update the file using `files.update` method
		const response = await drive.files.update({
			fileId: fileId,
			media: {
				mimeType: 'application/pdf',
				body: fileData,
			},
		});

		console.log('File updated successfully:', response.data);
	} catch (error) {
		console.error('Error updating the file:', error.message);
	}
}

module.exports = {

}