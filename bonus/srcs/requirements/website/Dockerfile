ARG DEBIAN_VERSION=trixie
FROM debian:${DEBIAN_VERSION}

RUN apt-get update && apt-get install -y \
    nginx \
    && rm -rf /var/lib/apt/lists/*

# Copier le site dans le dossier web
COPY public/ /var/www/html/

# Config NGINX minimale pour servir le site sur le port 80
RUN echo "server { \
    listen 80; \
    server_name _; \
    root /var/www/html; \
    index index.html; \
    location / { \
        try_files \$uri \$uri/ =404; \
    } \
}" > /etc/nginx/sites-available/default

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
