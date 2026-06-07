<p><em>This project has been created as part of the 42 curriculum by <b>banne</b>, <b>jhauvill</b>, <b>jcrochet</b>, <b>aronnet<b>, <b>thlibers</b> and <b>nclavel</b>.</em></p>

# ft_transcendence
## Description:


## Usage:
1. Create a .env file that contain variable that will be use in the infrastructure
```plaintext
# --- MONGODB ---
(required) MONGO_ADMIN_USER={USERNAME}
(required) MONGO_ADMIN_PASS={PASSWORD}
(required) MONGO_USER={USERNAME}
(required) MONGO_PASS={PASSWORD}
```
2. Launch the infrastructure with:
```sh
make up
```
3. Shutdown the infrastructure with:
```sh
make down
```
- If you need to rebuild a container and restart the infrastructure
```sh
make re
```
- If you need to factory reset everything that is used in the container (including volumes)
```sh
# SUDO IS REQUIRED DELETE VOLUMES DATA
sudo make reset
```
- For collaborative work, 
```sh
# SUDO IS REQUIRED TO ADD YOUR USER TO THE DOCKER GROUP AND APPEND YOUR IP TO /etc/hosts
sudo make setup IP={IP_OF_THE_SERVER}
```

## Docs :
[Game server documentation](https://github.com/banne227/ft_transcendence/blob/main/docs/GAME_SERVER.md)
[Infrastructures documentation](https://github.com/banne227/ft_transcendence/blob/main/docs/INFRA.md)
[API documentation](https://github.com/banne227/ft_transcendence/blob/main/docs/API.md)

<!-- "Powered By:" badges -->
<div align="center">
  <h2>Powered By:</h2>
	<a rel="MongoDB" href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white"></a>
	<a rel="Typescript" href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white"></a>
	<a rel="NodeJS" href="https://nodejs.org"><img src="https://img.shields.io/badge/node.js-6DA55F.svg?style=for-the-badge&logo=node.js&logoColor=white"></a>
	<a rel="Socket.IO" href="https://socket.io/"><img src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101"></a>
	<a rel="ExpressJS" href="https://expressjs.com/en/"><img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB"></a>
	<a rel="Nginx" href="https://nginx.org/"><img src="https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white"></a>
</div>
