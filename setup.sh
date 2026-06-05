
if [ $EUID -ne 0 ]; then
	printf "\x1b[31m[!] SUDO privileges is required\x1b[0m\n"
	exit 1
elif [ "$1" == "" ]; then
	if [ $3 == "" ]; then
		printf "\x1b[31m[!] Usage script w make: make setup IP={IP_OF_THE_SERVER} HOST={ASSOCIATED_DOMAIN}\x1b[0m\n"
	else
		printf "\x1b[31m[!] Usage: $0 {IP_OF_THE_SERVER} {ASSOCIATED_DOMAIN}\x1b[0m\n"
	fi
	exit 1
fi

if [ "$2" == "" ]; then
	domain="transcendence.42.fr"
else
	domain="$2"
fi

hostsLastLine=$(cat /etc/hosts | tail -n1 | sed -z "s/\n//")

printf "[-] DEBUG\n"
printf "Have in file = \'$(echo -n $hostsLastLine | awk -F'[ \t]+' '{print $2}' | cat -e)\', expected = \'$domain\'\n"
printf "Have in file = \'$(echo -n $hostsLastLine | awk -F'[ \t]+' '{print $1}' | cat -e)\', expected = \'$1\'\"\n"
printf "\n"

if [ "$(echo -n $hostsLastLine | awk -F'[ \t]+' '{print $2}')" == "$domain" ] && [ "$(echo -n $hostsLastLine | awk -F'[ \t]+' '{print $1}')" == "$1" ]; then
	printf "[-] $1:$domain is already in /etc/hosts\n"
else
	printf "[-] $1:$domain have been added to /etc/hosts\n"
	printf "$1\t$domain" >> /etc/hosts
fi
