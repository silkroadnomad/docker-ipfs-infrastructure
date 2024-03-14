import { yamux } from '@chainsafe/libp2p-yamux'
import { createLibp2p } from 'libp2p'
import { noise } from '@chainsafe/libp2p-noise'
import { circuitRelayTransport,circuitRelayServer } from '@libp2p/circuit-relay-v2'
import { tcp } from '@libp2p/tcp'
import { webSockets } from '@libp2p/websockets'
import * as filters from '@libp2p/websockets/filters'
import { identify } from '@libp2p/identify'
import { createFromPrivKey } from '@libp2p/peer-id-factory'
import { unmarshalPrivateKey } from '@libp2p/crypto/keys'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import {bootstrap} from "@libp2p/bootstrap";
import {pubsubPeerDiscovery} from "@libp2p/pubsub-peer-discovery";
import {ping} from "@libp2p/ping";
import {autoNAT} from "@libp2p/autonat";
import {dcutr} from "@libp2p/dcutr";
import {gossipsub} from "@chainsafe/libp2p-gossipsub";
import 'dotenv/config'

// import {bootstrapConfig} from "./config.js";

// output of: console.log(server.peerId.privateKey.toString('hex'))
const relayPrivKey = process.env.RELAY_PRIVATE_KEY;
// the peer id of the above key
// const relayId = '12D3KooWAJjbRkp8FPF5MKgMU53aUTxWkqvDrs4zc1VMbwRwfsbE'

const encoded = uint8ArrayFromString(relayPrivKey, 'hex')
const privateKey = await unmarshalPrivateKey(encoded)
const peerId = await createFromPrivKey(privateKey)

const server =
	await createLibp2p({
		peerId,
		addresses: {
			listen: ['/ip4/0.0.0.0/tcp/12345/ws'],
			announce: ['/dns4/ipfs.le-space.de//tcp/443/wss']
		},
		transports: [
			circuitRelayTransport(),
			tcp(),
			webSockets({
				filter: filters.all
			})
		],
		connectionEncryption: [noise()],
		streamMuxers: [yamux()],
		peerDiscovery: [
			bootstrap({
				list: ['/ip4/159.69.119.82/udp/9090/webrtc-direct/certhash/uEiAIh0DoA5Qk2xTpc_j58KZMvww9CQzN6UNgsJ-DTuM6XQ/p2p/12D3KooWF5fGyE4VeXMhSGd9rCwckyxCVkA6xfoyFJG9DWJis62v']}),
			pubsubPeerDiscovery({
				interval: 1000,
				topics: ['dev-dcontact._peer-discovery._p2p._pubsub','dcontact._peer-discovery._p2p._pubsub'], // defaults to ['_peer-discovery._p2p._pubsub']
				listenOnly: false
			})
		],
		services: {
			ping: ping({
				protocolPrefix: 'dContact', // default
			}),
			identify: identify(),
			autoNAT: autoNAT(),
			dcutr: dcutr(),
			pubsub: gossipsub({allowPublishToZeroPeers: true, canRelayMessage: true}),
			relay: circuitRelayServer({
				reservations: {
					maxReservations: 5000,
					reservationTtl: 1000,
					defaultDataLimit: BigInt(1024 * 1024 * 1024)
				}
			})
		}
	})
server.addEventListener('peer:connect', async event => {
	console.log('peer:connect', event.detail)
})

server.addEventListener('peer:disconnect', async event => {
	console.log('peer:disconnect', event.detail)
	server.peerStore.delete(event.detail)
})

console.log(server.peerId.toString())
console.log('p2p addr: ', server.getMultiaddrs().map((ma) => ma.toString()))
// generates a deterministic address: /ip4/127.0.0.1/tcp/33519/ws/p2p/12D3KooWAJjbRkp8FPF5MKgMU53aUTxWkqvDrs4zc1VMbwRwfsbE
