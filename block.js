const SHA256 = require('crypto-js/sha256');
const { DIFFICULTY, MINE_RATE } = require('./config'); // Importez les deux constantes

class Block {
    constructor(timestamp, lastHash, hash, data, nonce, difficulty = DIFFICULTY) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    static genesis() {
        return new this('Genesis time', '-----', 'f1r57-h45h', [], 0, DIFFICULTY);
    }

    static mineBlock(lastBlock, data) {
        let hash, timestamp;
        const lastHash = lastBlock.hash;
        let nonce = 0;
        let { difficulty } = lastBlock; // Utilisation de la déstructuration

        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp); // Ajustez la difficulté à chaque tentative
            hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }

    static hash(timestamp, lastHash, data, nonce, difficulty) {
        return SHA256(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }

    static blockHash(block) {
        const { timestamp, lastHash, data, nonce, difficulty } = block;
        return Block.hash(timestamp, lastHash, data, nonce, difficulty);
    }

    static adjustDifficulty(lastBlock, currentTime) {
        let { difficulty } = lastBlock;
        const difference = currentTime - lastBlock.timestamp;

        if (difficulty > 1 && difference > MINE_RATE) {
            difficulty--;
        }

        if (difficulty < 10 && difference < MINE_RATE) { // Ajout d'une limite supérieure optionnelle
            difficulty++;
        }

        return difficulty;
    }

    toString() {
        return `Block -
            Timestamp: ${this.timestamp}
            Last Hash: ${this.lastHash.substring(0, 10)}
            Hash     : ${this.hash.substring(0, 10)}
            Nonce    : ${this.nonce}
            Difficulty: ${this.difficulty}
            Data     : ${this.data}`;
    }
}

module.exports = Block;