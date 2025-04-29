const WebSocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5002;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2pServer {
    constructor(blockchain) {
        this.blockchain = blockchain;
        this.sockets = [];
    }

    listen() {
        const server = new WebSocket.Server({ port: P2P_PORT });
        console.log(`Serveur P2P démarré sur le port ${P2P_PORT}`);

        server.on('connection', socket => this.connectSocket(socket));

        this.connectToPeers();
    }

    connectToPeers() {
        peers.forEach(peer => {
            const socket = new WebSocket(peer);

            socket.on('open', () => this.connectSocket(socket));
        });
    }

    connectSocket(socket) {
        this.sockets.push(socket);
        console.log('Socket connecté');

        this.messageHandler(socket); // Attachez le gestionnaire de messages à la connexion

        this.sendChain(socket); // Envoyez la chaîne actuelle au nouveau connecté
    }

    messageHandler(socket) {
        socket.on('message', message => {
            const data = JSON.parse(message);
            console.log('Données reçues du socket:', data);
            this.blockchain.replaceChain(data); // Utilisez la fonction de remplacement de chaîne de votre blockchain
        });
    }

    sendChain(socket) {
        socket.send(JSON.stringify(this.blockchain.chain));
    }

    syncChain() {
        this.sockets.forEach(socket => this.sendChain(socket));
    }
}

module.exports = P2pServer;