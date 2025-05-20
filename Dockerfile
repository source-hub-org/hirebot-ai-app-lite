FROM oven/bun:1.1-slim

WORKDIR /app

COPY package.json bun.lockb* ./

RUN bun install --frozen-lockfile --development

COPY . .

ENV NODE_ENV=development

EXPOSE 3000

CMD ["bun", "dev"]