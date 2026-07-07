# =========================
# NEXT BUILD
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
# FINAL
# =========================
FROM node:20-alpine AS final

WORKDIR /app


# Instala nginx e supervisor
RUN apk add --no-cache nginx supervisor


# -------------------------
# Next
# -------------------------
COPY --from=next-build /workspace/package.json ./
COPY --from=next-build /workspace/node_modules ./node_modules
COPY --from=next-build /workspace/.next ./.next
COPY --from=next-build /workspace/public ./public


# -------------------------
# Angular
# -------------------------
COPY --from=angular-build /dashboard/dist/rencard_dashboard_and_auth/browser /usr/share/nginx/html/app


# -------------------------
# Nginx
# -------------------------
COPY nginx.conf /etc/nginx/http.d/default.conf


# -------------------------
# Supervisor
# -------------------------
COPY supervisord.conf /etc/supervisord.conf


EXPOSE 80


CMD ["supervisord", "-c", "/etc/supervisord.conf"]