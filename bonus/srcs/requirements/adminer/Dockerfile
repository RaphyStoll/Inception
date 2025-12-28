ARG DEBIAN_VERSION=trixie
FROM debian:${DEBIAN_VERSION}

RUN apt-get update && apt-get install -y \
    wget \
    php \
    php-mysql \
    && rm -rf /var/lib/apt/lists/*

COPY tools/init_adminer.sh /usr/local/bin/init_adminer.sh
RUN chmod +x /usr/local/bin/init_adminer.sh

EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/init_adminer.sh"]
