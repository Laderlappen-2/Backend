FROM node:current

WORKDIR /usr/src/api

COPY src ./src

# Add our package file
ADD package.json ./
ADD tsconfig.json ./

ENV NODE_ENV=development
RUN npm install