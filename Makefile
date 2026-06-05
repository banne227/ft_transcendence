
# [?] Les deux synthax sont possible selon votre VM
DC	:=	docker compose
#DC	:=	docker-compose

all: up

down:
	@printf "\x1b[0;32m[+] Shutdown every running container ...\n\x1b[0m"
	@$(DC) down
	@printf "\x1b[0;32m[+] Shutdown every running docker network connection ...\n\x1b[0m"
	@yes | docker network prune > /dev/null 2>&1

up:
	@sh ./services/genCert.sh > /dev/null 2>&1
	@mkdir -p ./data/mongodb
	@printf "\x1b[0;32m[+] Starting every running container ...\n\x1b[0m"
	@$(DC) up -d

re: down
	@printf "\x1b[0;32m[+] Removing old certificate ...\n\x1b[0m"
	@rm -rf ./cert
	@printf "\x1b[0;32m[+] Rebuilding container ...\n\x1b[0m"
	@$(DC) build
	@make up -s

reset: down
	@sh ./.reset.sh

setup:
	@sh ./setup.sh $(IP) $(HOST)

.PHONY: re up down reset
