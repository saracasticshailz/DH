# First Stage: Build the React/Vite App
FROM node:23-alpine AS build

RUN ls -ltra

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package*.json /app

# Install dependencies inside the web directory
RUN npm install

# Copy the rest of the application files
COPY . /app

RUN chmod -R 777 /app

# Build the application
RUN npm run build

# Second Stage: Serve the App with a lightweight web server
FROM docker.io/nginx:alpine AS production

RUN mkdir -p /usr/share/nginx/html/dreamhome-web

# Set working directory
WORKDIR /usr/share/nginx/html/dreamhome-web

RUN ls -ltra

# Copy built files from the previous stage
COPY --from=build /app/dist . 

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]