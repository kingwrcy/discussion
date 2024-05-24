# Nuxt 3 builder
FROM node:22.2.0-alpine as builder

ARG VERSION

WORKDIR /app

COPY package*.json ./

# 安装生产依赖
RUN npm install --production --no-optional

# 复制整个项目
COPY . .

# 生成Prisma客户端
RUN npx prisma generate

RUN echo $VERSION > /app/version

ENV NODE_ENV=production

# 构建Nuxt应用
RUN npm run build

# Nuxt 3 production
FROM node:22.2.0-alpine

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

RUN npm init -y
RUN npm install -g prisma
EXPOSE 3000

RUN chmod +x /app/start.sh
CMD /app/start.sh