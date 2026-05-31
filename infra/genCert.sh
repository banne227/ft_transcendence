mkdir -p ./cert

if [ ! -d ./cert ]; then
	openssl req -x509 -nodes -days 365 -newkey rsa:4096 -subj "/C=XX/ST=Saturn/L=SaturnCity/O=XXX/OU=Transcendence Inc/CN=trancendence.42.fr" -keyout ./cert/nginx.key -out ./cert/nginx.crt
fi
