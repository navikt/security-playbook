FROM node@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5 AS build
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
RUN corepack enable
COPY .npmrc pnpm-workspace.yaml package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Export the client bundle SBOM without including it in the served files.
FROM scratch AS sbom
COPY --from=build /app/build/cyclonedx/bom.json /frontend.cdx.json

FROM build AS static
RUN rm -rf /app/build/cyclonedx

# Production stage
FROM cgr.dev/chainguard/nginx AS production
COPY --from=static /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
