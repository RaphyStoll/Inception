#!/bin/bash

if ! id "$FTP_USER" &>/dev/null; then

    useradd -m -s /bin/bash $FTP_USER
    echo "$FTP_USER:$FTP_PASSWORD" | chpasswd

    echo "$FTP_USER" > /etc/vsftpd.userlist

    mkdir -p /var/run/vsftpd/empty
fi

usermod -aG www-data $FTP_USER
chown -R www-data:www-data /var/www/html

echo "Starting vsftpd..."
exec /usr/sbin/vsftpd /etc/vsftpd.conf
