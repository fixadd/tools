# 1) Build aşaması
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2) Serve aşaması (nginx)
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# SPA (Vue Router history) gerekiyorsa aşağıdaki conf'u da ekleyebilirsin (bkz. not)
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
