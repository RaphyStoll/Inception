ARG DEBIAN_VERSION=trixie
FROM debian:${DEBIAN_VERSION}

RUN apt-get update && apt-get install -y \
    curl \
    php-fpm \
    php-mysql \
    php-redis \
    mariadb-client \
    && rm -rf /var/lib/apt/lists/*

# Installer WP-CLI
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar && \
    chmod +x wp-cli.phar && \
    mv wp-cli.phar /usr/local/bin/wp

COPY conf/www.conf /etc/php/www.conf.temp
# Déplacer le fichier de conf au bon endroit (indépendant de la version de PHP)
RUN mv /etc/php/www.conf.temp /etc/php/*/fpm/pool.d/www.conf

COPY tools/auto_config.sh /usr/local/bin/auto_config.sh
RUN chmod +x /usr/local/bin/auto_config.sh

EXPOSE 9000

ENTRYPOINT ["/usr/local/bin/auto_config.sh"]
