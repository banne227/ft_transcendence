#!/bin/bash

if [ $EUID -ne 0 ]; then
	printf "\e[31m[!] SUDO privileges is required\e[0m\n"
	exit 1
elif [ "$1" == "" ]; then
	printf "\e[31m[!] Usage script w make: make setup IP={IP_OF_THE_SERVER}\e[0m\n"
	exit 1
fi

domain="transcendence.42.fr"

hostsLastLine=$(cat /etc/hosts | tail -n1 | sed -z "s/\n//")

printf "[-] DEBUG\n"
printf "Have in file = \'$(echo -n $hostsLastLine | awk -F'[ \t]+' '{print $2}' | cat -e)\', expected = \'$domain\'\n"
printf "Have in file = \'$(echo -n $hostsLastLine | awk -F'[ \t]+' '{print $1}' | cat -e)\', expected = \'$1\'\"\n"
printf "\n"

if [ "$(echo -n $hostsLastLine | awk -F'[ \t]+' '{print $2}')" == "$domain" ] && [ "$(echo -n $hostsLastLine | awk -F'[ \t]+' '{print $1}')" == "$1" ]; then
	printf "[-] $1:$domain is already in /etc/hosts\n"
else
	if [ "$(echo -n $hostsLastLine | awk -F'[ \t]+' '{print $2}')" == "$domain" ]; then
		sed -i '$d' /etc/hosts
	fi
	printf "[-] $1:$domain have been added to /etc/hosts\n"
	printf "$1\t$domain" >> /etc/hosts
fi
