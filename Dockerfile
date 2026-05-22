# syntax=docker/dockerfile:1

# Build stage for the landing page app
FROM node:20-alpine AS build
WORKDIR /workspace

COPY rencard/package.json rencard/package-lock.json ./
COPY rencard/next.config.ts rencard/postcss.config.mjs rencard/tsconfig.json ./
COPY rencard/public ./public
COPY rencard/src ./src

RUN npm ci \
    && npm run build

# Final stage with nginx
FROM nginx:stable-alpine AS final
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /workspace/out /usr/share/nginx/html
COPY dashboard/dist/rencard_dashboard_and_auth/browser /usr/share/nginx/html/app

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
