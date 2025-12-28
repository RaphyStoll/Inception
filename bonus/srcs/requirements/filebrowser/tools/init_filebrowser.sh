#!/bin/bash

FB_DB="/etc/filebrowser.db"
FB_ROOT="/var/www/html"
FB_PORT=8080

if [ ! -f /usr/local/bin/filebrowser ]; then
    echo "Downloading File Browser..."
    curl -fsSL https://raw.githubusercontent.com/filebrowser/get/master/get.sh | bash
fi

if [ ! -f "$FB_DB" ]; then
    echo "Initializing database..."

    filebrowser config init --database "$FB_DB"
    
    filebrowser config set --address "0.0.0.0" --port "$FB_PORT" --root "$FB_ROOT" --auth.method=json --signup=false --baseURL "/filebrowser" --database "$FB_DB"

    USER=${FTP_USER:-admin}
    PASS=${FTP_PASSWORD:-admin}
    
    echo "Creating user $USER..."

    if filebrowser users add "$USER" "$PASS" --database "$FB_DB" --perm.admin; then
        echo "User created successfully."
    else 
        #Fallback mdp trop cours dansn .env devient StrongPass123!@#
        echo "Password '$PASS' might be too easy. Using fallback."
        STRONG_PASS="StrongPass123!@#"
        filebrowser users add "$USER" "$STRONG_PASS" --database "$FB_DB" --perm.admin
    fi
else
    echo "Database already exists. Skipping initialization."
    filebrowser config set --address "0.0.0.0" --port "$FB_PORT" --root "$FB_ROOT" --baseURL "/filebrowser" --database "$FB_DB"

    USER=${FTP_USER:-admin}
    PASS=${FTP_PASSWORD:-admin}
    echo "Updating user $USER password..."
    filebrowser users update "$USER" --password "$PASS" --database "$FB_DB" || \
    filebrowser users update "$USER" --password "StrongPass123!@#" --database "$FB_DB"
fi


echo "Starting File Browser..."
exec filebrowser --database "$FB_DB"
