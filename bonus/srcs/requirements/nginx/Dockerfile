ARG DEBIAN_VERSION=trixie
FROM debian:${DEBIAN_VERSION}

RUN apt-get update && apt-get install -y \
    nginx \
    openssl \
    && rm -rf /var/lib/apt/lists/*

COPY conf/nginx.conf /etc/nginx/conf.d/defaut.conf
COPY tools/init_nginx.sh /usr/local/bin/init_nginx.sh

RUN chmod +x /usr/local/bin/init_nginx.sh

EXPOSE 443

ENTRYPOINT ["/usr/local/bin/init_nginx.sh"]
