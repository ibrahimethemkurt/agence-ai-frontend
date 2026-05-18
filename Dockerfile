# ─── Build stage ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Sadece bağımlılık dosyalarını kopyala (cache optimizasyonu)
COPY package*.json ./
RUN npm ci --frozen-lockfile

# Kaynak kodu kopyala
COPY . .

# Build argümanları (GitHub Actions'tan gelecek)
ARG VITE_API_URL
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN npm run build

# ─── Production stage ──────────────────────────────────────────────────────────
FROM nginx:1.25-alpine AS production

# Nginx konfigürasyonu (SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Build çıktısını kopyala
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
