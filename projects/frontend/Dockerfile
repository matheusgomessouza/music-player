# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Production stage (nginx)
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 3000;
    
    location / {
        root /usr/share/nginx/html;
        try_files \$uri \$uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend:3001/api;
    }
}
EOF

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
