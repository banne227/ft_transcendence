FILENAME=.env

printf "[+] Checking .env file ...\n"

cat $FILENAME > /dev/null
if [ $? -ne 0 ]; then
	exit 1;
fi

if [ "$(cat $FILENAME | grep "MONGO_ADMIN_USER" | awk -F= '{print $2}')" == "" ]; then
	printf "[!] Missing MONGO_ADMIN_USER environment variable in $FILENAME\n"
	exit 1
elif [ "$(cat $FILENAME | grep "MONGO_ADMIN_PASS" | awk -F= '{print $2}')" == "" ]; then
	printf "[!] Missing MONGO_ADMIN_PASS environment variable in $FILENAME\n"
	exit 1
elif [ "$(cat $FILENAME | grep "MONGO_USER" | awk -F= '{print $2}')" == "" ]; then
	printf "[!] Missing MONGO_USER environment variable in $FILENAME\n"
	exit 1
elif [ "$(cat $FILENAME | grep "MONGO_PASS" | awk -F= '{print $2}')" == "" ]; then
	printf "[!] Missing MONGO_PASS environment variable in $FILENAME\n"
	exit 1
fi
