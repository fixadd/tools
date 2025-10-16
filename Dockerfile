# 1) Build aşaması
FROM node:20-alpine AS build
WORKDIR /app

# package.json ve lock dosyası frontend klasöründen gelsin
COPY frontend/package*.json ./
RUN npm install

# tüm kaynak kodu frontend klasöründen kopyala
COPY frontend/. .

RUN npm run build

# 2) Serve aşaması (nginx)
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

