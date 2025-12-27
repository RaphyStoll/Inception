#!/bin/bash

# Créer le répertoire pour les certificats SSL s'il n'existe pas
mkdir -p /etc/nginx/ssl

# Générer le certificat SSL auto-signé s'il n'existe pas
if [ ! -f /etc/nginx/ssl/inception.crt ]; then
    echo "Génération du certificat SSL pour $DOMAIN_NAME..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/inception.key \
    -out /etc/nginx/ssl/inception.crt \
    -subj "/C=CH/ST=VD/L=Lausanne/O=42/OU=42/CN=$DOMAIN_NAME"
fi

# Remplacer les variables d'environnement dans la configuration NGINX
# On n'utilise pas envsubst sur tout le fichier pour éviter de casser la syntaxe nginx ($uri, etc.)
# Mais comme on a mis ${DOMAIN_NAME} dans le fichier conf, on peut le remplacer manuellement ou via envsubst avec restriction.
# Ici, une méthode simple avec sed pour la variable spécifique.
sed -i "s/\${DOMAIN_NAME}/$DOMAIN_NAME/g" /etc/nginx/conf.d/defaut.conf

echo "Démarrage de NGINX..."
nginx -g "daemon off;"
