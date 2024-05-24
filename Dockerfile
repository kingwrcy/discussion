# Nuxt 3 builder
FROM node:20-alpine as builder

ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/usr/local/bin
RUN pnpm add --global prisma

ARG VERSION

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# 安装生产依赖
RUN pnpm install --frozen-lockfile --prod

# 复制整个项目
COPY . .

# 生成Prisma客户端
RUN npx prisma generate

RUN echo $VERSION > /app/version


# 构建Nuxt应用
RUN pnpm run build

# Nuxt 3 production
FROM node:20-alpine
RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/usr/local/bin
RUN pnpm add --global prisma

WORKDIR /app

ENV NODE_ENV=production
ENV NUXT_JWT_SECRET_KEY="67vdu9Bw951Kga4"
ENV NUXT_PUBLIC_TOKEN_KEY="xdGXgHi4tYj9hjo"
ENV NUXT_PUBLIC_AVATAR_CDN="https://gravatar.cooluc.com/avatar/"
ENV SIMPLE_DISCUSS_VERSION=$VERSION

COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/prisma /app/prisma
COPY --from=builder /app/version /app/version
COPY --from=builder /app/start.sh /app/start.sh
EXPOSE 3000

RUN chmod +x /app/start.sh
CMD /app/start.sh