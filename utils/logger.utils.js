const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        // In production (Vercel), we'll only use console logging
        this.isProduction = process.env.NODE_ENV === 'production';
    }

    logRequest(details) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${details.method} ${details.url} - Params: ${JSON.stringify(details.params)} - Body: ${JSON.stringify(details.body)} - Status: ${details.status} - ResponseTime: ${details.responseTime}ms`;

        // In production, just use console logging
        if (this.isProduction) {
            console.log(logMessage);
            return;
        }

        // Local development logging to file
        try {
            const logDirectory = './tmp';
            if (!fs.existsSync(logDirectory)) {
                fs.mkdirSync(logDirectory, { recursive: true });
            }

            const logFile = path.join(logDirectory, `${new Date().toISOString().split('T')[0].replace(/-/g,'_')}.log`);
            fs.appendFileSync(logFile, logMessage + '\n');
            console.log(logMessage);
        } catch (error) {
            console.error('Logging failed:', error);
            // Fallback to console
            console.log(logMessage);
        }
    }
}

module.exports = new Logger();