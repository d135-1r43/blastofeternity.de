# The site is prerendered to plain HTML, so the image is a web server with the
# build baked in — the first stage runs `pnpm build`, the second serves what it
# produced and carries no toolchain at all.

FROM node:26-alpine AS build
WORKDIR /app

ENV CI=true

# Dependencies first, so a content or component change does not re-resolve them.
# Node no longer ships corepack, so it is installed to pick up the pnpm
# version pinned in package.json's `packageManager` field.
COPY package.json pnpm-lock.yaml .npmrc ./
RUN npm install --global corepack@latest \
	&& corepack enable \
	&& pnpm install --frozen-lockfile

COPY . .
RUN pnpm build


FROM nginxinc/nginx-unprivileged:alpine AS runtime

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

# The base image runs as uid 101 and so listens above 1024.
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
	CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
