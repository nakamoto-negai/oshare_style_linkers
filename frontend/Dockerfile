# Node.js (Vite)用Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json bun.lockb ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev", "--", "--host"]
