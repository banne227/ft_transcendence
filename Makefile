
# [?] Les deux synthax sont possible selon votre VM
DC	:=	docker compose
#DC	:=	docker-compose

all: up

down:
	@printf "\e[0;32m[+] Shutdown every running container ...\n\e[0m"
	@$(DC) down
	@printf "\e[0;32m[+] Shutdown every running docker network connection ...\n\e[0m"
	@yes | docker network prune > /dev/null 2>&1

up:
	@bash --posix ./.scripts/genCert.sh > /dev/null 2>&1
	@mkdir -p ./data/mongodb
	@printf "\e[0;32m[+] Starting every running container ...\n\e[0m"
	@bash --posix ./.scripts/checkEnv.sh
	@$(DC) up -d

re: down
	@printf "\e[0;32m[+] Removing old certificate ...\n\e[0m"
	@rm -rf ./cert
	@bash --posix ./.scripts/checkEnv.sh
	@printf "\e[0;32m[+] Rebuilding container ...\n\e[0m"
	@$(DC) build
	@make up -s

reset: down
	@bash --posix ./.scripts/.reset.sh

setup:
	@bash ./.scripts/setup.sh $(IP) $(HOST)

.PHONY: re up down reset setup
