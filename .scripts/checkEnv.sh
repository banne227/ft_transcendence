#!/bin/bash

FILENAME=.env

printf "\e[0;33m[!] Checking .env file ...\n\e[0m"

cat $FILENAME > /dev/null
if [ $? -ne 0 ]; then
	exit 1;
fi

if [ "$(cat $FILENAME | grep "MONGO_ADMIN_USER" | awk -F= '{print $2}')" == "" ]; then
	printf "\e[0;31m[!] Missing MONGO_ADMIN_USER environment variable in $FILENAME, exiting ...\n\e[0m"
	exit 1
elif [ "$(cat $FILENAME | grep "MONGO_ADMIN_PASS" | awk -F= '{print $2}')" == "" ]; then
	printf "\e[0;31m[!] Missing MONGO_ADMIN_PASS environment variable in $FILENAME, exiting ...\n\e[0m"
	exit 1
elif [ "$(cat $FILENAME | grep "MONGO_USER" | awk -F= '{print $2}')" == "" ]; then
	printf "\e[0;31m[!] Missing MONGO_USER environment variable in $FILENAME, exiting ...\n\e[0m"
	exit 1
elif [ "$(cat $FILENAME | grep "MONGO_PASS" | awk -F= '{print $2}')" == "" ]; then
	printf "\e[0;31m[!] Missing MONGO_PASS environment variable in $FILENAME, exiting ...\n\e[0m"
	exit 1
fi
