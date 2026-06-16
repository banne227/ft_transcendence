#!/bin/bash

if [ "$1" == "" ]; then
	printf "\e[31m[!] Usage script w make: make debug A={name_of_the_services}\e[0m\n"
	exit 1
fi
container_id=$(docker ps | grep "$(basename "$PWD")-$1" | awk '{print $1}')
if [ "$container_id" == "" ]; then
	printf "\e[31m[!] Failed to find the container $1\e[0m\n"
	exit 1
fi
docker exec -it $container_id bash
if [ $? == 127 ]; then
	docker exec -it $container_id sh
	if [ $? == 127 ]; then
		printf "\e[31m[!] Failed to enter in the container $1\e[0m\n"
		exit 1
	fi
fi
