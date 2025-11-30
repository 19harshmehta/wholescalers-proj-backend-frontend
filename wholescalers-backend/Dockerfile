FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .
COPY --from=builder /app/server.js .
COPY --from=builder /app/routes ./routes
COPY --from=builder /app/controllers ./controllers
COPY --from=builder /app/models ./models
COPY --from=builder /app/middlewares ./middlewares
COPY --from=builder /app/utils ./utils

EXPOSE 4000

CMD ["npm", "start"]
