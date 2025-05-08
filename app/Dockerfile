# #Instructions
# FROM node:22

# # Goes to the app directory
# WORKDIR /app

# # copy package.json and package-lock.json
# COPY package*.json ./

# #Install app dependencies - Happens when building the image
# RUN npm install     

# #copy the rest of our app into the container
# COPY . .

# #set port environment variable
# ENV PORT=9000

# #expose the port so our computer can access it
# EXPOSE 9000

# #Run the app - uses CMD to START the container AFTER building - If we use RUN here, the container will never
# CMD ["npm", "start"]

# Use the official Node.js image from Docker Hub
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json if available
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire app directory contents into the container
COPY . .

# Expose the API port
EXPOSE 8000

# Command to run your application
CMD ["node", "server.js"]
