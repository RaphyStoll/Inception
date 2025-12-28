ARG DEBIAN_VERSION=trixie
FROM debian:${DEBIAN_VERSION}

RUN apt-get update && apt-get install -y \
    curl \
    bash \
    && rm -rf /var/lib/apt/lists/*

COPY tools/init_filebrowser.sh /usr/local/bin/init_filebrowser.sh
RUN chmod +x /usr/local/bin/init_filebrowser.sh

EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/init_filebrowser.sh"]
