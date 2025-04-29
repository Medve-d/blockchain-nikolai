const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const P2pServer = require('./p2p-server');

const app = express();
const blockchain = new Blockchain();
const p2pServer = new P2pServer(blockchain);

app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/mine', (req, res) => {
    const { data } = req.body;
    if (!data) {
        return res.status(400).json({ error: 'Les données du bloc sont requises.' });
    }
    blockchain.addBlock(data);
    res.json(blockchain.chain[blockchain.chain.length - 1]);
    p2pServer.syncChain(); // Diffuser la nouvelle chaîne à tous les pairs
});

const HTTP_PORT = 3000;
app.listen(HTTP_PORT, () => {
    console.log(`Serveur API démarré sur le port ${HTTP_PORT}`);
    p2pServer.listen();
});