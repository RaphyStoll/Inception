#!/bin/bash

# Dossier web
mkdir -p /var/www/html

# Télécharger Adminer s'il n'est pas déjà là
if [ ! -f /var/www/html/index.php ]; then
    echo "Downloading Adminer..."
    wget "https://github.com/vrana/adminer/releases/download/v4.8.1/adminer-4.8.1.php" -O /var/www/html/index.php
    chown -R www-data:www-data /var/www/html
fi

echo "Starting Adminer..."
# Lancement du serveur interne PHP sur le port 8080
# c'est suffisant pour le bonus, pas besoin de PHP-FPM + NGINX lourd ici
exec php -S 0.0.0.0:8080 -t /var/www/html
