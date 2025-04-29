const Blockchain = require('./blockchain');
const Block = require('./block');

describe("Blockchain", () => {
    let blockchain;
    let blockchain2;

    beforeEach(() => {
        blockchain = new Blockchain();
        blockchain2 = new Blockchain();
    });

    it("starts with genesis block", () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it("add a new block", () => {
        const data = 'foo';
        blockchain.addBlock(data);
        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(data);
    });

    it("validates a valid chain", () => {
        blockchain2.addBlock('foo');
        expect(blockchain2.isValidChain(blockchain2.chain)).toBe(true); // Appel sur l'instance
    });

    it("invalidates a corrupted genesis block", () => {
        blockchain2.chain[0].data = 'corrupted';
        expect(blockchain2.isValidChain(blockchain2.chain)).toBe(false); // Appel sur l'instance
    });

    it("invalidates a corrupt chain", () => {
        blockchain2.addBlock('foo');
        blockchain2.chain[1].data = 'not foo';
        expect(blockchain2.isValidChain(blockchain2.chain)).toBe(false); // Appel sur l'instance
    });

    it("replaces the chain with a valid chain", () => {
        blockchain2.addBlock('goo');
        blockchain.replaceChain(blockchain2.chain);
        expect(blockchain.chain).toEqual(blockchain2.chain);
    });

    it("does not replaces the chain with less than or equal chain", () => {
        blockchain.addBlock('foo');
        blockchain.replaceChain(blockchain2.chain);
        expect(blockchain.chain).not.toEqual(blockchain2.chain);
    });
});