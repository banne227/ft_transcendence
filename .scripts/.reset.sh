#!/bin/bash

if [ $EUID -ne 0 ]; then
	printf "\e[31m[!] SUDO privileges is required\e[0m\n"
	exit 1
fi

printf "\e[0;32m[+] Shutting down infrastructure ...\n\e[0m"
make down
printf "\e[0;32m[+] Removing volumes ...\n\e[0m"
docker volume rm $(docker volume ls | grep "ft_transcendence" | awk '{print $2}') || true
printf "\e[0;32m[+] Removing content of the volumes ...\n\e[0m"
rm -rf ./data
printf "\e[0;32m[+] Removing old certificate ...\n\e[0m"
rm -rf ./cert
