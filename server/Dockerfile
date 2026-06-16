FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY server/package.json server/package.json

RUN npm install --workspace server

COPY server server

EXPOSE 5000

CMD ["npm", "start", "--workspace", "server"]

