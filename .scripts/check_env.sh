FILENAME=.env

printf "[+] Checking .env file ...\n"
elif [ "$(cat $FILENAME | grep MONGODB_PORT | awk -F= '{print $2}')" == "" ] || [ $? -ne 0 ]; then
	printf "[!] Missing MONGODB_PORT environment variable\n"
	exit 1
elif [ "$(cat $FILENAME | grep MONGO_INITDB_ROOT_USERNAME | awk -F= '{print $2}')" == "" ] || [ $? -ne 0 ]; then
	printf "[!] Missing MONGO_INITDB_ROOT_USERNAME environment variable\n"
	exit 1
elif [ "$(cat $FILENAME | grep MONGO_INITDB_ROOT_PASSWORD | awk -F= '{print $2}')" == "" ] || [ $? -ne 0 ]; then
	printf "[!] Missing MONGO_INITDB_ROOT_PASSWORD environment variable\n"
	exit 1
fi
