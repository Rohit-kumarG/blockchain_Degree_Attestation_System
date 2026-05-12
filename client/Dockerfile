FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY client/package.json client/package.json

RUN npm install --workspace client

COPY client client

EXPOSE 5173

CMD ["npm", "run", "dev", "--workspace", "client", "--", "--host", "0.0.0.0"]

