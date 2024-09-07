const fs = require('fs');
const path = require('path')

class Logger {
    constructor() {
        // check if the logs directory exists
        this.logDirectory = path.join(__dirname, '../logs');
        this.createLogDirectory();
    }

    createLogDirectory() {
        if (!fs.existsSync(this.logDirectory)) {
            fs.mkdirSync(this.logDirectory, { recursive: true });
        }
    }

    getLogFilePath() {
        const date = new Date().toISOString().split('T')[0];
        return path.join(this.logDirectory, `${date}.log`)
    }

    // Log request and response details
    logRequest(details) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${details.method} ${details.url} - Params: ${JSON.stringify(details.params)} - Body: ${JSON.stringify(details.body)} - Status: ${details.status} - ResponseTime: ${details.responseTime}ms\n`;

        const logFilePath = this.getLogFilePath(); 

        fs.appendFile(logFilePath, logMessage, (err) => {
            if (err) console.error('Failed to write log:', err);
        });

        console.log(logMessage);
    }
}

module.exports = new Logger();