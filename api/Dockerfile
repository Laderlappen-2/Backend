FROM node:10.16.3

# App Directory
WORKDIR /usr/src/api

# Move Code
COPY ./src .

# Install Dependencies
COPY ./src/package*.json ./
RUN npm install

# Expose for alternative HTTPS port
EXPOSE 8080

# Run
CMD ["npm", "run", "start"]
