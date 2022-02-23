FROM node:latest as base
RUN apt update && apt upgrade -y
RUN apt install -y gcc g++ make python python3 python3-pip default-jre default-jdk
COPY package*.json ./
RUN npm install --save-dev
RUN npm install --save
COPY . .
CMD [ "node", "server.js" ]
