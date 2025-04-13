# FROM node:9-slim
# WORKDIR /index
# COPY package.json /index
# RUN npm install
# COPY . /index
# CMD [ "npm", "start" ]

# Use an official Node.js runtime as a base image
FROM node:14-slim

# Set the working directory inside the container
WORKDIR /index

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./index

# Install the project dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Expose the port that your application will listen on
EXPOSE 3000

# Define the command to start your application
CMD ["npm", "start"]