const request = require('supertest');
const express = require('express'); // Importez express ici
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const app = express();
const blockchain = new Blockchain();

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
});

let server;

beforeAll((done) => {
    const PORT = 3001; // Utilisez un port différent de celui de votre app.js principal pour éviter les conflits
    server = app.listen(PORT, () => {
        console.log(`Serveur de test démarré sur le port ${PORT}`);
        done(); // Indique à Jest que l'opération asynchrone est terminée
    });
});

afterAll((done) => {
    server.close(done); // Ferme le serveur après l'exécution de tous les tests
});

describe('API Tests', () => {
    it('should GET the blockchain', async () => {
        const res = await request(server) // Utilisez 'server' au lieu de 'app'
            .get('/blocks')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should POST and mine a new block', async () => {
        const newData = 'Données de test pour le nouveau bloc';
        const postRes = await request(server) // Utilisez 'server' au lieu de 'app'
            .post('/mine')
            .send({ data: newData })
            .expect('Content-Type', /json/)
            .expect(200);

        expect(postRes.body.data).toBe(newData);

        const getRes = await request(server) // Utilisez 'server' au lieu de 'app'
            .get('/blocks');

        expect(getRes.body.length).toBeGreaterThan(1);
        expect(getRes.body[getRes.body.length - 1].data).toBe(newData);
    });

    it('should return an error if no data is provided for mining', async () => {
        const res = await request(server) // Utilisez 'server' au lieu de 'app'
            .post('/mine')
            .send({})
            .expect('Content-Type', /json/)
            .expect(400);

        expect(res.body.error).toBe('Les données du bloc sont requises.');
    });
});