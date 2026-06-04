
if [ $EUID -ne 0 ]; then
	printf "\x1b[31m[!] SUDO privileges is required\x1b[0m\n"
	exit 1
elif [ "$1" == "" ]; then
	printf "\x1b[31m[!] Usage: $0 {IP_OF_THE_SERVER}\x1b[0m\n"
	exit 1
fi

last_line=$(cat /etc/hosts | tail -n1)

echo $last_line
if [ "$(echo $last_line | awk -F\t '{print $2}')" != "transcendence.42.fr" ] && [ "$(echo $last_line | awk -F\t '{print $2}')" != "$1" ]; then
	printf "[-] Putting transcendence.42.fr pointing to $1\n"
	printf "$1\ttranscendence.42.fr" >> /etc/hosts
else
	printf "[-] Putting transcendence.42.fr pointing to $1\n"
fi
