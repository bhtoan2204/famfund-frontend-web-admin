# Stage 1: Build the Next.js app
FROM node:20-alpine AS builder
ENV NODE_ENV production

WORKDIR /app

# Copy package.json and yarn.lock
COPY . .

# Install dependencies
# RUN yarn install --frozen-lockfile

# Build the Next.js app as static files
RUN yarn build

# Stage 2: Serve the static files with Nginx
FROM nginx:1.21.0-alpine AS production
ENV NODE_ENV production

# Copy the static files to Nginx html folder
COPY --from=builder /app/out /usr/share/nginx/html

# Copy Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
