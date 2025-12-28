#!/bin/bash

# Initialisation du répertoire de données si vide (au cas où)
if [ ! -d "/var/lib/mysql/mysql" ]; then
    mariadb-install-db --user=mysql --datadir=/var/lib/mysql
fi

# Démarrer MariaDB temporairement en tâche de fond
mariadbd-safe --skip-networking &
pid="$!"

# Attendre que le serveur soit prêt
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

# Créer la base de données et l'utilisateur avec droits complets pour l'accès externe
mysql -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;"
mysql -e "CREATE USER IF NOT EXISTS \`${DB_USER}\`@'%' IDENTIFIED BY '${DB_PASSWORD}';"
mysql -e "GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO \`${DB_USER}\`@'%';"
mysql -e "FLUSH PRIVILEGES;"

# Changer le mot de passe root (si pas déjà fait)
# Note: Sur Debian récent, root utilise souvent unix_socket. On force un mot de passe pour la compatibilité si besoin.
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '${DB_ROOT_PASSWORD}';"

echo "Arrêt du serveur temporaire..."
mysqladmin -u root -p${DB_ROOT_PASSWORD} shutdown
wait "$pid"

echo "Démarrage définitif de MariaDB..."
exec mariadbd-safe
