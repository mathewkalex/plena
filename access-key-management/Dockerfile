# Dockerfile for Access Key Management Microservice

# Use the official Node.js image as base
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Clear npm cache forcefully
RUN npm cache clean --force

# Install dependencies
RUN npm install --production

# Copy the rest of the application
COPY . .

# Expose the port on which the microservice will run
EXPOSE 3001

# Command to run the application
CMD ["npm", "start"]
