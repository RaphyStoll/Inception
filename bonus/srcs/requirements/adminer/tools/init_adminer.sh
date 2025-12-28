#!/bin/bash

mkdir -p /var/www/html

if [ ! -f /var/www/html/index.php ]; then
    echo "Downloading Adminer..."
    wget "https://github.com/vrana/adminer/releases/download/v4.8.1/adminer-4.8.1.php" -O /var/www/html/index.php
    chown -R www-data:www-data /var/www/html
fi

echo "Starting Adminer..."

exec php -S 0.0.0.0:8080 -t /var/www/html
