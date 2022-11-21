# IPFS-Node-Infrastructure
## Description

This project should be a good starting point for setting up an IPFS-Node with a couple of necessary components (e.g. secure websockets, WebRTC, Nginx, LetsEncrypt, Pinning Service etc.)

1. We need an IPFS Node which is accessible by secure websockets (wss) if possible on a public reachable host. For that reason I updated and adapted the howtos of: 
- WillSchenk ["Setting up an IPFS-node"](https://willschenk.com/articles/2019/setting_up_an_ipfs_node/) 
- Philipp Schmieder Medien (Seybothenreuth, Germany) ["Nginx and Let’s Encrypt with Docker in Less Than 5 Minutes"]  (https://pentacent.medium.com/nginx-and-lets-encrypt-with-docker-in-less-than-5-minutes-b4b8a60d3a71)

2. A WebRTC-Star gateway should be also installed so browsers can use it as signaling server. WebRTC usually also needs a STUN and TURN servers. https://hub.docker.com/r/libp2p/websocket-star-rendezvous

3. When publishing our IFPS-Documents they are still centralized. When ever we publish anything we should inform a pinning service (e.g. https://pinata.cloud, https://estuary.tech , https://web3.storage) or you are going to create your own https://github.com/ipfs-shipyard/rb-pinning-service-api (untested)

##  Installation
1. Find a linux hoster [install docker and docker-compose](https://docs.docker.com/engine/install/ubuntu/) 
2. Git clone this repo
3. Run ``cd ipfs/willschenk/`` and run ```docker-compose up -d``` here nginx will exit first time 
4. Edit and run ``./init-letsencrypt.sh`` line 8,11,12 in order to install letsencrypt certificates
5. Edit line 6 (SERVER_NAME) in docker-compose.yml Run ```docker-compose up -d``` in order to run all components
6. Check if nginx, certbot and ipfs node are running ```docker-compose ps``` check logs for possible errors ```docker-compose logs```
7. Check to see if you have IPFS peers ```curl -X POST http://127.0.0.1:5001/api/v0/swarm/peers|jq```
8. and via command line ```docker-compose exec ipfs ipfs swarm peers```
9. Check the IPFS-Gatewayy ```curl https://ipfs.le-space.de/ipfs/QmPChd2hVbrJ6bfo3WBcTW4iZnpHm8TEzWkLHmLpXhF68A```
10. Check the API isn't exposed to the internet from your machine ```curl http://ipfs.le-space.de:5001/api/v0/swarm/peers|jq```
11. Checking WebSockets: Visit https://www.websocket.org/echo.html and put in the address of your server to make sure that you can connect over websockets. In my case, it's wss://ipfs.le-space.de:4003

## TODO 
1. Test react-example
2. Install and Test webrtc-star
3. Install turn and stun server with webrtc-star
4. Install/Implement pinning server 

## References 
- ["Setting up an IPFS-node"](https://willschenk.com/articles/2019/setting_up_an_ipfs_node/) 
- ["Nginx and Let’s Encrypt with Docker in Less Than 5 Minutes"](https://pentacent.medium.com/nginx-and-lets-encrypt-with-docker-in-less-than-5-minutes-b4b8a60d3a71)
