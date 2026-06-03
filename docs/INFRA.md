<div align="center">
	<h1>< STILL IN BUILD ></h1>
</div>

# Infra
## Description
- Our transcendence infrastructure is composed by four services who are containerized in docker container:
### NGINX
- Nginx is a free and opensource software that can do a lot of thing different like web server, reverse proxy, load balancer, mail proxy or HTTP cache.
- In our infrastructure NGINX are acting like a web server that serve the html pages statically and secured with encryption between the client and the NGINX server using TLS 1.2 or TLS 1.3
- Every client-side content should be put on the "frontend" directory in services/nginx
### MangoDB
- MangoDB is a free source-available NoSQL (Not Only SQL) documents-oriented databased who use BJSON (Binary JavaScript Object Notation) instead of SQL to add, remove or find data. 
### game_server
- Host the game server
### RESTApi
- Host API

## TROUBLESHOOT
```
Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
```
Potential solution :
```sh
# Add your user to the docker group
sudo usermod -aG docker $USER && sudo systemctl restart docker
# Launch the docker with sudo
sudo make up
```
---
```
Error response from daemon: error while mounting volume '/var/lib/docker/volumes/ft_transcendence_mongodb/_data': failed to mount local volume: mount /usr/local/sbin:/usr/local/bin:/usr/bin:/usr/bin/site_perl:/usr/bin/vendor_perl:/usr/bin/core_perl/data/mongodb:/var/lib/docker/volumes/ft_transcendence_mongodb/_data, flags: 0x1000: no such file or directory
```
Potential solution :
```sh
# Try to delete every volumes folder (in sudo)
make adm
```
