#!/bin/bash

mkdir -p /etc/nginx/ssl

if [ ! -f /etc/nginx/ssl/inception.crt ]; then
    echo "Génération du certificat SSL pour $DOMAIN_NAME..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/inception.key \
    -out /etc/nginx/ssl/inception.crt \
    -subj "/C=CH/ST=VD/L=Lausanne/O=42/OU=42/CN=$DOMAIN_NAME"
fi

sed -i "s/\${DOMAIN_NAME}/$DOMAIN_NAME/g" /etc/nginx/conf.d/defaut.conf

echo "Démarrage de NGINX..."
nginx -g "daemon off;"
