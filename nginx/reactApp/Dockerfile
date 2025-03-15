 # Step 1: Use an official Node.js image to build the React app
 FROM node:20.12.2 AS build

 # Set the working directory inside the container
 WORKDIR /app
 
 # Copy the package.json and package-lock.json to install dependencies
 COPY ./package*.json .
 
 ARG REACT_APP_API_URL
 
 ENV REACT_APP_API_URL=${EC2_IP}
 
 # Install dependencies
 RUN npm install
 
 # Copy the rest of the application code into the container
 COPY . .
 
 # Build the React app for production
 RUN npm run build
 
 # Step 2: Set up an NGINX image to serve the build directory
 FROM nginx:alpine
 
 # Copy the React build output to NGINX's default directory
 COPY --from=build /app/dist /usr/share/nginx/html
 
 # Copy custom NGINX configuration
 COPY ./default.conf /etc/nginx/nginx.conf
 
 # Expose port 80
 EXPOSE 80
 
 # Start NGINX
 CMD ["nginx", "-g", "daemon off;"]