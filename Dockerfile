# Etapa 1: Dependencias
FROM node:20-alpine AS deps
# Instalar dependencias necesarias para algunos paquetes de node nativos
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./
# Instalar dependencias (usar npm ci es mejor para CI/CD si package-lock.json está actualizado)
RUN npm install

# Etapa 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables de entorno por defecto que Next.js puede necesitar durante el build
# No se incluyen secretos aquí, los secretos reales se pasan en tiempo de ejecución.
ENV NEXT_TELEMETRY_DISABLED=1

# Compilar el proyecto (aquí se usa el modo standalone gracias a next.config.ts)
RUN npm run build

# Etapa 3: Runner (Imagen final)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar la carpeta public
COPY --from=builder /app/public ./public

# Configurar los permisos correctos para el directorio .next
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copiar los archivos generados en la fase de build (modo standalone)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Ejecutar el servidor. En modo standalone, Next.js usa server.js
CMD ["node", "server.js"]
