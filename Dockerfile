# syntax=docker/dockerfile:1

# =========================
# NEXT.JS BUILD
# =========================
FROM node:20-alpine AS next-build

WORKDIR /workspace

COPY rencard/package.json rencard/package-lock.json ./
COPY rencard/next.config.ts rencard/postcss.config.mjs rencard/tsconfig.json ./
COPY rencard/public ./public
COPY rencard/src ./src

RUN npm ci && npm run build

# =========================
# ANGULAR BUILD
# =========================
FROM node:20-alpine AS angular-build

WORKDIR /dashboard

COPY dashboard/package.json dashboard/package-lock.json ./

RUN npm ci

COPY dashboard .

RUN npm run build

# =========================
# FINAL NGINX
# =========================
FROM nginx:stable-alpine AS final

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Landing page Next
COPY --from=next-build /workspace/out /usr/share/nginx/html

# Dashboard Angular
COPY --from=angular-build /dashboard/dist/rencard_dashboard_and_auth/browser /usr/share/nginx/html/app

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]