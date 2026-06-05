FILENAME=template.env

CONTENT=$(cat $FILENAME)

echo $CONTENT | awk '{print $2}'
if [ $? -ne 0 ]; then
	exit 1
elif [ "$(cat $FILENAME | grep MONGODB_PORT | awk -F= '{print $2}')" == "" ]; then
	printf "[!] Missing MONGODB_PORT environment variable\n"
	exit 1
elif [ "$(cat $FILENAME | grep MONGO_INITDB_ROOT_USERNAME | awk -F= '{print $2}')" == "" ]; then
	printf "[!] Missing MONGO_INITDB_ROOT_USERNAME environment variable\n"
	exit 1
elif [ "$(cat $FILENAME | grep MONGO_INITDB_ROOT_PASSWORD | awk -F= '{print $2}')" == "" ]; then
	printf "[!] Missing MONGO_INITDB_ROOT_PASSWORD environment variable\n"
	exit 1
fi
