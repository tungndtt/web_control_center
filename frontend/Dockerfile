# pull official base image
FROM node:14.16.1-alpine

ARG WORKING_DIR=/wcc-frontend

# set working directory
WORKDIR ${WORKING_DIR}

# add `/webcontroller/node_modules/.bin` to $PATH
ENV PATH ${WORKING_DIR}/node_modules/.bin:$PATH

# install dependencies
COPY package.json ./
COPY package-lock.json ./
COPY src ./src
COPY public ./public
RUN npm install --silent
RUN npm install react-scripts@4.0.3 -g --silent

# start app
ENTRYPOINT ["npm", "start"]