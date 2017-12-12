const DevBlockChain = require('./structs/DevBlockChain');
const blockHlpr = require('./helpers/block');
const proofHlpr = require('./helpers/proof');

const blockchain = new DevBlockChain();

let prevBlock = blockchain.getLastBlock();
console.log('----------------------------------------------------------------------');
console.log(`Block: ${prevBlock.__index}`);
console.log(`Hash: ${prevBlock.__hash}`);
console.log(`Nonce: ${prevBlock.__nonce}`);
console.log('----------------------------------------------------------------------');
const numOfBlocksToAdd = 32;

for (let i = 0; i < numOfBlocksToAdd; i += 1) {
  const blockToAdd = blockHlpr.nextBlock(prevBlock, [{
    from: 'from_address',
    to: 'to_address',
    fee: 0,
    sign: 'sha256_signature',
    data: {}
  }]);
  blockToAdd.setNonce(proofHlpr.work(blockToAdd.__hash, blockchain.__prefix));
  blockchain.concatBlock(blockToAdd);
  prevBlock = blockToAdd;
  console.log(`Block: ${blockToAdd.__index}`);
  console.log(`Hash: ${blockToAdd.__hash}`);
  console.log(`Nonce: ${blockToAdd.__nonce}`);
  console.log('----------------------------------------------------------------------');
}
