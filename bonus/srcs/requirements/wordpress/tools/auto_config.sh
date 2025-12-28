#!/bin/bash

echo "Waiting for MariaDB..."
sleep 10

cd /var/www/html

if [ ! -f "/var/www/html/wp-config.php" ]; then
    echo "WordPress configuration not found. Installing..."
    
    wp config create \
        --dbname=$DB_NAME \
        --dbuser=$DB_USER \
        --dbpass=$DB_PASSWORD \
        --dbhost=mariadb \
        --allow-root

    wp core install \
        --url=$DOMAIN_NAME \
        --title="Inception" \
        --admin_user=$WP_ADMIN_USER \
        --admin_password=$WP_ADMIN_PASSWORD \
        --admin_email=$WP_ADMIN_EMAIL \
        --skip-email \
        --allow-root

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

wp config set WP_REDIS_HOST redis --allow-root
wp config set WP_REDIS_PORT 6379 --allow-root
wp plugin install redis-cache --activate --allow-root
wp redis enable --allow-root

mkdir -p /run/php

PHP_VERSION=$(ls /etc/php/ | sort -n | tail -1)
echo "Starting PHP-FPM $PHP_VERSION..."

exec /usr/sbin/php-fpm$PHP_VERSION -F
