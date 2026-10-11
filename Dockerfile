# Minflix Events waitlist: production image (Node 20, Debian slim so `sharp` works out of the box)
FROM node:20-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production PORT=3000
COPY --from=build --chown=node:node /app ./
EXPOSE 3000
USER node
CMD ["npm", "start"]
