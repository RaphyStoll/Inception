name = inception

all:
	@printf "Lancement de la configuration ${name}...\n"
	@docker-compose -f ./srcs/docker-compose.yml up -d --build

build:
	@printf "Construction de la configuration ${name}...\n"
	@docker-compose -f ./srcs/docker-compose.yml up -d --build

down:
	@printf "Arrêt de la configuration ${name}...\n"
	@docker-compose -f ./srcs/docker-compose.yml down

re: fclean all

clean: down
	@printf "Nettoyage de la configuration ${name}...\n"
	@docker system prune -a

fclean: clean
	@printf "Nettoyage complet de la configuration ${name}...\n"
	@docker system prune --all --force --volumes
	@docker network prune --force
	@docker volume prune --force

.PHONY: all build down re clean fclean
