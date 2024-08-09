# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install the project dependencies
RUN npm install --production

# Copy the rest of the application's code into the container
COPY . .

# Build the React app for production
RUN npm run build

# Install a lightweight HTTP server to serve the React app
RUN npm install -g serve

# Set the environment variable for production
ENV NODE_ENV production

# Expose port 8002 to the host
EXPOSE 8002

# Command to serve the app on port 8002
CMD ["serve", "-s", "build", "-l", "8002"]
