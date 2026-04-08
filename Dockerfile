FROM node:24-alpine AS build
USER root
WORKDIR /app
RUN npm install -g pnpm@10.11.0
COPY .npmrc pnpm-workspace.yaml package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Production stage
FROM cgr.dev/chainguard/nginx AS production
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
