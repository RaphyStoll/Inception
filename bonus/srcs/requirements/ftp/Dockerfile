ARG DEBIAN_VERSION=trixie
FROM debian:${DEBIAN_VERSION}

RUN apt-get update && apt-get install -y \
    vsftpd \
    && rm -rf /var/lib/apt/lists/*

COPY conf/vsftpd.conf /etc/vsftpd.conf
COPY tools/init_ftp.sh /usr/local/bin/init_ftp.sh

RUN chmod +x /usr/local/bin/init_ftp.sh

# Ports: 21 (Command) + 21100-21110 (Passive data)
EXPOSE 21 21100-21110

ENTRYPOINT ["/usr/local/bin/init_ftp.sh"]
