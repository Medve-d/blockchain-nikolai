const Block = require('./block');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock(data) {
        const lastBlock = this.chain[this.chain.length - 1];
        const newBlock = Block.mineBlock(lastBlock, data);
        this.chain.push(newBlock);
    }

    static blockHash(block) {
        // Retourne le hash d'un bloc en utilisant ses propriétés
        const { timestamp, lastHash, data, nonce, difficulty } = block;
        return Block.hash(timestamp, lastHash, data, nonce, difficulty);
    }

    isValidChain(chain) {
        // Vérifie si la chaîne commence par le bloc genesis
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        // Vérifie chaque bloc de la chaîne
        for (let i = 1; i < chain.length; i++) {
            const { lastHash, hash } = chain[i];
            const actualLastHash = chain[i - 1].hash;

            if (lastHash !== actualLastHash || hash !== Blockchain.blockHash(chain[i])) {
                return false;
            }
        }

        return true;
    }

    replaceChain(chain) {
        // Remplace la chaîne actuelle si la nouvelle chaîne est valide et plus longue
        if (chain.length <= this.chain.length) {
            console.error('La chaîne reçue n\'est pas plus longue.');
            return;
        }

        if (!this.isValidChain(chain)) {
            console.error('La chaîne reçue n\'est pas valide.');
            return;
        }

        console.log('Remplacement de la chaîne par la nouvelle chaîne.');
        this.chain = chain;
    }
}

module.exports = Blockchain;
