const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain'); // Assurez-vous que le chemin vers votre fichier blockchain.js est correct

const app = express();
const blockchain = new Blockchain();

app.use(bodyParser.json());

// Point d'entrée pour récupérer la chaîne de blocs
app.get('/blocks', (req, res) => {
    res.json(blockchain.chain);
});

// Point d'entrée pour miner un nouveau bloc
app.post('/mine', (req, res) => {
    const { data } = req.body;

    if (!data) {
        return res.status(400).json({ error: 'Les données du bloc sont requises.' });
    }

    blockchain.addBlock(data);
    res.json(blockchain.chain[blockchain.chain.length - 1]);
});

// Démarrez le serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur API démarré sur le port ${PORT}`);
});