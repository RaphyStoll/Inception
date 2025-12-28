#!/bin/bash

# Créer l'utilisateur FTP s'il n'existe pas
if ! id "$FTP_USER" &>/dev/null; then
    # Créer le groupe s'il n'existe pas (souvent www-data est 33)
    useradd -m -s /bin/bash $FTP_USER
    echo "$FTP_USER:$FTP_PASSWORD" | chpasswd
    
    # Ajouter l'utilisateur à la liste des autorisés
    echo "$FTP_USER" > /etc/vsftpd.userlist
    
    # Créer le dossier vide pour le secure_chroot si inexistant
    mkdir -p /var/run/vsftpd/empty
fi

# Astuce importante : pour que le FTP puisse écrire dans les fichiers de WordPress (qui appartiennent à www-data)
# on ajoute l'user ftp au groupe www-data et on force les permissions
usermod -aG www-data $FTP_USER
chown -R www-data:www-data /var/www/html

echo "Starting vsftpd..."
exec /usr/sbin/vsftpd /etc/vsftpd.conf
