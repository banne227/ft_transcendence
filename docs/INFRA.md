<div align="center">
	<h1>< STILL IN BUILD ></h1>
</div>

# "ft_transcendence" infrastructure :
## Description
- "ft_transcendence" infrastructure is composed by four services who are containerized in docker container:
### NGINX
- Nginx is a free and opensource software that can do a lot of thing different like web server, reverse proxy, load balancer, mail proxy or HTTP cache.
- In our infrastructure NGINX are acting like a web server that serve the html pages statically and secured with encryption between the client and the NGINX server using TLS 1.2 or TLS 1.3
- Every client-side content should be put on the "frontend" directory in services/nginx
### mongoDB
- mongoDB is a free source-available NoSQL (Not Only SQL) documents-oriented databased who use BJSON (Binary JavaScript Object Notation) instead of SQL to add, remove or find data.
- When the container start, a shell script that create a admin user (defined with MONGO_ADMIN_USER and MONGO_ADMIN_PASS environments variables) who manage every databases and a second user (defined with MONGO_USER and MONGO_PASS environments variables) who manage a databases called "databases" which store users information like the username, email, hashed/salted password and a subtable which contain an history of every passed match of the user
### game_server
- Host the game server
### API
- API container

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
sudo make reset
```
---
- Firefox can't connect to to the site while being launch
Potential solution :
```sh
# Check that every container is launched
docker ps

# EXPECTED OUTPUT :
CONTAINER ID   IMAGE                      COMMAND                  CREATED              STATUS              PORTS                                      NAMES
<rand_id>   ft_transcendence-mongodb   "docker-entrypoint.s…"   About a minute ago   Up About a minute   0.0.0.0:27017->27017/tcp                   ft_transcendence-mongodb-1
<rand_id>   ft_transcendence-nginx     "/docker-entrypoint.…"   About a minute ago   Up About a minute   0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp   ft_transcendence-nginx-1
<rand_id>   ft_transcendence-game      "npm run dev"            About a minute ago   Up About a minute   3000/tcp                                   ft_transcendence-game-1
```
```md
## Firefox
1. Go to your Firefox settings
2. Go to the "Privacy & Security" section
3. Go at the bottom of the page
4. In "DNS over HTTPS" you have a "Manage Exceptions..." button
5. On the textbox "Enter website domain name" put "127.0.0.1" or the hostname you assiates in /etc/hosts
```

To implement:
- https://github.com/tiagozip/cap
