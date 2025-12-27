#!/bin/bash

# Attendre que MariaDB soit prête
echo "Waiting for MariaDB..."
sleep 10

cd /var/www/html

if [ ! -f "/var/www/html/wp-config.php" ]; then
    echo "WordPress configuration not found. Installing..."
    
    # Télécharger WP-CLI
    curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
    chmod +x wp-cli.phar
    mv wp-cli.phar /usr/local/bin/wp

    # Télécharger WordPress
    wp core download --allow-root

    # Créer le fichier de configuration
    wp config create \
        --dbname=$DB_NAME \
        --dbuser=$DB_USER \
        --dbpass=$DB_PASSWORD \
        --dbhost=mariadb \
        --allow-root

    # Installer WordPress
    wp core install \
        --url=$DOMAIN_NAME \
        --title="Inception" \
        --admin_user=$WP_ADMIN_USER \
        --admin_password=$WP_ADMIN_PASSWORD \
        --admin_email=$WP_ADMIN_EMAIL \
        --skip-email \
        --allow-root

    # Créer un utilisateur additionnel
    wp user create \
        $WP_USER \
        $WP_EMAIL \
        --user_pass=$WP_PASSWORD \
        --role=author \
        --allow-root
        
    echo "WordPress installed successfully."
else
    echo "WordPress is already installed."
fi

# Assurer que le dossier run php existe
mkdir -p /run/php

# Détecter la version de PHP et lancer FPM
PHP_VERSION=$(ls /etc/php/ | sort -n | tail -1)
echo "Starting PHP-FPM $PHP_VERSION..."
exec /usr/sbin/php-fpm$PHP_VERSION -F
