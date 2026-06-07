mkdir -p ./cert

if [ $(ls ./cert/ | wc -w) -ne 3 ]; then
	printf "\x1b[0;32m[+] Generating new certificate ...\n\x1b[0m"
	openssl req -x509 -nodes -days 365 -newkey rsa:4096 -subj "/C=XX/ST=Saturn/L=SaturnCity/O=XXX/OU=Transcendence Inc/CN=trancendence.42.fr" -keyout $(pwd)/cert/nginx.key -out $(pwd)/cert/nginx.crt > /dev/null
	openssl req -x509 -nodes -days 365 -newkey rsa:4096 -subj "/C=XX/ST=Saturn/L=SaturnCity/O=XXX/OU=Transcendence Inc/CN=trancendence.42.fr" -keyout $(pwd)/cert/mongo.key > /dev/null
fi
