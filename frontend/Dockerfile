FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build Vite app
RUN npm run build

# Serve static files
RUN npm install -g serve

CMD ["serve", "-s", "dist", "-l", "5173"]