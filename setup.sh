
if [ $EUID -ne 0 ]; then
	printf "\x1b[31m[!] SUDO privileges is required\x1b[0m\n"
	exit 1
elif [ "$1" == "" ]; then
	printf "\x1b[31m[!] Usage: $0 {IP_OF_THE_SERVER}\x1b[0m\n"
	exit 1
fi

if [ "$(cat /etc/hosts | tail -n1 | awk -F\t '{print $2}')" != "transcendence.42.fr" ]; then

fi
