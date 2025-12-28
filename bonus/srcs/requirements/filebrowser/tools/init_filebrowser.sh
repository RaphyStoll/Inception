#!/bin/bash

# Configuration
FB_DB="/etc/filebrowser.db"
FB_ROOT="/var/www/html"
FB_PORT=8080

# Téléchargement (si non présent)
if [ ! -f /usr/local/bin/filebrowser ]; then
    echo "Downloading File Browser..."
    curl -fsSL https://raw.githubusercontent.com/filebrowser/get/master/get.sh | bash
fi

# Initialisation de la base de données
# Initialisation de la base de données
if [ ! -f "$FB_DB" ]; then
    echo "Initializing database..."
    # 1. Initialiser la DB vide
    filebrowser config init --database "$FB_DB"
    
    # 2. Configurer l'écoute sur 0.0.0.0 (CRUCIAL pour docker) et désactiver le signup + définir baseURL
    filebrowser config set --address "0.0.0.0" --port "$FB_PORT" --root "$FB_ROOT" --auth.method=json --signup=false --baseURL "/filebrowser" --database "$FB_DB"
    
    # Création de l'admin
    # FileBrowser exige 12 caractères minimum pour le mot de passe
    USER=${FTP_USER:-admin}
    PASS=${FTP_PASSWORD:-admin}
    
    echo "Creating user $USER..."
    # On essaie de créer l'utilisateur.
    if filebrowser users add "$USER" "$PASS" --database "$FB_DB" --perm.admin; then
        echo "User created successfully."
    else 
        # Fallback si échec (mot de passe trop court etc)
        # Note : Si la DB n'existait pas, l'user n'existe pas non plus, donc pas de update à faire ici.
        echo "Password '$PASS' might be too easy. Using fallback."
        STRONG_PASS="StrongPass123!@#"
        filebrowser users add "$USER" "$STRONG_PASS" --database "$FB_DB" --perm.admin
    fi
else
    echo "Database already exists. Skipping initialization."
    # On s'assure quand même que la config adresse est bonne (au cas où) et on force le baseURL
    filebrowser config set --address "0.0.0.0" --port "$FB_PORT" --root "$FB_ROOT" --baseURL "/filebrowser" --database "$FB_DB"
    
    # Mise à jour du mot de passe admin si changé dans le .env
    USER=${FTP_USER:-admin}
    PASS=${FTP_PASSWORD:-admin}
    echo "Updating user $USER password..."
    filebrowser users update "$USER" --password "$PASS" --database "$FB_DB" || \
    filebrowser users update "$USER" --password "StrongPass123!@#" --database "$FB_DB"
fi


echo "Starting File Browser..."
exec filebrowser --database "$FB_DB"
