# Websocket libp2p-relay

## Description 

This is a docker image and docker compose file which runs a 
- NodeJS websocket relay for libp2p with 
- nginx and
- letsencrypt

## Usage
0. Copy .env.example to .env and change to your environment
1. Modify init-letsencrypt.sh (domains=(ipfs.le-space.de) around line 8) to setup your letsencrypt domain 
2. Run ```./init-letsencrypt.sh``` (letsencrypt is creating ssl certificates for nginx)
3. Run ```docker-compose up -d``` (nginx, letsencrypt, relay-service starting)
4. Run ```docker-compose logs``` and find the libp2p address to connect your peers

## Todo
- [x] move private key from relay.js into .env
- [x] SERVER_NAME inside docker-compose.yml should go into .env
- [ ] init-letsencrypt.sh should take SERVER_NAME as an argument or environment variable 
- [ ] make listen addresses of relay service configurable via .env / docker-compose
- [ ] make bootstrap seed nodes configurable via .env / docker-compose
- [ ] make pubsubPeerDiscovery topics configurable via .env / docker-compose
- [ ] make announce: ['/dns4/ipfs.le-space.de//tcp/443/wss'] configurable via .env / docker-compose