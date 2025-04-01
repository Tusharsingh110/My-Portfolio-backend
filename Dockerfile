# Use Node.js 18 as the base image (LTS version)
FROM node:18-slim

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application source
COPY . .

# Create tmp directory for logging (though in production it will use console logging)
RUN mkdir -p tmp

# Set environment variables
ENV NODE_ENV=production
ENV PORT=9000

# Expose the port
EXPOSE 9000

# Start the application
CMD [ "node", "index.js" ] 