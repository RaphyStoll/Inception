#!/bin/bash

if [ ! -d "/var/lib/mysql/mysql" ]; then
    mariadb-install-db --user=mysql --datadir=/var/lib/mysql
fi

mariadbd-safe --skip-networking &
pid="$!"

echo "En attente du démarrage de MariaDB..."
for i in {30..0}; do
    if mysqladmin ping --silent; then
        break
    fi
    sleep 1
done

if [ "$i" = 0 ]; then
    echo "Erreur: Impossible de démarrer MariaDB."
    exit 1
fi

echo "Configuration de MariaDB..."

mysql -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;"
mysql -e "CREATE USER IF NOT EXISTS \`${DB_USER}\`@'%' IDENTIFIED BY '${DB_PASSWORD}';"
mysql -e "GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO \`${DB_USER}\`@'%';"
mysql -e "FLUSH PRIVILEGES;"

mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '${DB_ROOT_PASSWORD}';"

echo "Arrêt du serveur temporaire..."
mysqladmin -u root -p${DB_ROOT_PASSWORD} shutdown
wait "$pid"

echo "Démarrage définitif de MariaDB..."
exec mariadbd-safe
