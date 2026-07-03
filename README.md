<p><em>This project has been created as part of the 42 curriculum by <b>banne</b>, <b>jhauvill</b>, <b>jcrochet</b>, <b>aronnet</b>, <b>thlibers</b> and <b>nclavel</b>.</em></p>

# ft_transcendence
## Description:
- "ft_transcendence" is the last project of the 42 Common Core. On this project we had to create a an web application that has a frontend, backend, and a database containerized on multiple containers.
- We have chosen to replicate a game that we played when we were children called "slither.io" on a old MSDOS/Windows98 theme. In this game, you play a snake eat food to grow. A snake can die when its head touches the border of the map or the body of another snake. This game doesn't really have an end, you play on the map until you die or you close the window.
## Instructions:
1. Create a .env or copy template.env file who will contain every environment variable that will be use in the infrastructure
```plaintext
# --- API ---
// The password to generate user JWT (Json Web Token)
(required) JWT_SECRET=SECRET

# --- MONGODB ---
// Username of the administator user of every databases
(required) MONGO_ADMIN_USER=ADMIN_USERNAME 
// Password of the administator user of every databases
(required) MONGO_ADMIN_PASS=ADMIN_PASSWORD

// Username of the user who manage the "database" database that contain username, email, password and the user match history
(required) MONGO_USER=USERNAME
// password of the user who manage the "database" database that contain username, email, password and the user match history
(required) MONGO_PASS=PASSWORD
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
# PUT YOUR TWO VM IN BRIDGE ADAPTER
# --- ON THE SERVER ---
# Get the enp0s3/eth0 IP
ip addr
# SUDO IS REQUIRED TO ADD YOUR USER TO THE DOCKER GROUP AND APPEND YOUR IP TO /etc/hosts
sudo make setup IP=127.0.0.1

# --- ON THE CLIENT ---
# SUDO IS REQUIRED TO ADD YOUR USER TO THE DOCKER GROUP AND APPEND YOUR IP TO /etc/hosts
sudo make setup IP=IP_GET_FROM_THE_SERVER_IPADDR
```
- To debug a container easly
```sh
make debug A=container_name

# EXAMPLE
make debug A=mongodb
# OR
make debug A=mongo		# Will put on the mongodb container
# OR
make debug A=ngi			# Will put on the nginx container
```

## Ressources :
- [Game Server](https://github.com/banne227/ft_transcendence/blob/main/docs/game_server.md)
- [Infrastructures](https://github.com/banne227/ft_transcendence/blob/main/docs/infra.md)
- [API](https://github.com/banne227/ft_transcendence/blob/main/docs/api.md)

## Preview: 
<div align=center>
	<img src="./videos/showcase.gif">
	<img src="./videos/showcase2.gif">
</div>

## Team organization : 



## Point earned:
### Major: 
- Use a framework for both the frontend and backend
	- We use TailwindCSS for the frontend and ExpressJS for the backend
- Allow users to interact with other users.
	- User can play and chat with each other
- Implement real-time features using WebSockets or similar technology.
	- We use a websocket to generate frame and message send on the chat
- A public API to interact with the database with a secured API key, rate limiting, documentation, and at least 5 endpoints:
	- Our public API doesnt really interact with the database. The request rate is capped to 60 req/min by the API gateway, and our documentation is on /docs/api.md
- Implement a complete web-based game where users can play against each other.
	- The main goal of our game is to kill other player
- Remote players — Enable two players on separate computers to play the same game in real-time.
	- You need a little setup thing but it 100% possible (look **make setup** makefile rule)
- Multiplayer game (more than two players).
	- You dont really have a limited of player, the max we have played is 4 players
- Backend as microservices
	- Endpoint behind /api/auth is on the auth container
	- Endpoint behind /api is on the api container
	- Endpoint behind /jwt/validate is on the internal container
- Advanced analytics dashboard with data visualization
	- On /status you can get statistics based on the score you have done on passed game
### Minor: 
- Use a frontend framework (React, Vue, Angular, Svelte, etc.)
	- Like sayed before we use Tailwind
- Use a backend framework (Express, Fastify, NestJS, Django, etc.)
	- Like sayed before we use ExpressJS
- Use an ORM for the database.
	- We doesnt really use an ORM. ORM do the bridge between our OOP language and the SQL database, but us we use a NoSQL databases called Mongodb who use documents instead of relational for the database. So we use ODM instead of ORM
- Custom-made design system with reusable components, including a proper color palette, typography, and icons (minimum: 10 reusable components).
	- We have a custom color palette based on windows XP/98
- Game statistics and match history (requires a game module).
	- You can access to your game history on /api/history/USERNAME or on the /stats statistics page
- Game customization options.
	- You can change your skin. The desired skin will be keeped
- Implement spectator mode for games
	- When you die you are in specator mode

<!-- "Powered By:" badges -->
<div align="center">
  <h2>Powered By:</h2>
	<a rel="Nginx" href="https://nginx.org/"><img src="https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white"></a>
	<a rel="MongoDB" href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white"></a>
	<a rel="NodeJS" href="https://nodejs.org"><img src="https://img.shields.io/badge/node.js-6DA55F.svg?style=for-the-badge&logo=node.js&logoColor=white"></a>
	<a rel="Typescript" href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white"></a>
	<a rel="Docker" href="https://www.docker.com/"><img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white"></a>
	<a rel="ExpressJS" href="https://expressjs.com/en/"><img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB"></a>
	<a rel="Socket.IO" href="https://socket.io/"><img src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101"></a>
</div>
