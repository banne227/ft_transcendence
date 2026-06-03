
if [ $EUID -ne 0 ]; then
	printf "\x1b[31m[!] SUDO privileges is required\x1b[0m\n"
	exit 1
fi

printf "\x1b[0;32m[+] Removing volumes ...\n\x1b[0m"
docker volume rm $(docker volume ls | grep "ft_transcendence" | awk '{print $2}') || true
printf "\x1b[0;32m[+] Removing content of the volumes ...\n\x1b[0m"
rm -rf ./data
printf "\x1b[0;32m[+] Removing old certificate ...\n\x1b[0m"
rm -rf ./cert
