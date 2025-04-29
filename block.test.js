const Block = require('./block');
const { DIFFICULTY } = require('./config');

describe('Block', () => {
    let data, lastBlock, block;

    beforeEach(() => {
        data = 'bar';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data);
    });

    it('creates a block', () => {
        expect(block instanceof Block).toBe(true);
    });

    it('has the `data` to match the input', () => {
        expect(block.data).toEqual(data);
    });

    it('has the `lastHash` to match the hash of the last block', () => {
        expect(block.lastHash).toEqual(lastBlock.hash);
    });

    it('generates a hash that matches the difficulty', () => {
        expect(block.hash.substring(0, DIFFICULTY)).toEqual('0'.repeat(DIFFICULTY));
    });

    it('lowers difficulty for a slower generated block', () => {
        expect(Block.adjustDifficulty(block, block.timestamp + 30000)).toEqual(block.difficulty - 1);
    });

    it('raises difficulty for fast generated block', () => {
        expect(Block.adjustDifficulty(block, block.timestamp + 1)).toEqual(block.difficulty + 1);
    });
});