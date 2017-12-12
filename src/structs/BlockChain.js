const crypto = require('crypto');
const Transaction = require('./Transaction');
const Block = require('./Block');
const proof = require('../services/proof');

class Blockchain {
  constructor(prefix) {
    this.prefix = '00000' || prefix;
    this.fee = 1 || fee;
    this.chain = [];
    this.currentTransactions = [];
    this.chain.push(this.genesisBlock());
  }

  hash(block) {
    return crypto.createHash('sha256')
      .update(`${String(block.index)}.${String(block.previousHash)}.${JSON.stringify(block.transactions)}.${String(block.timestamp)}`)
      .digest('hex');
  }

  genesisBlock() {
    const prospectGenesisBlock = {
      index: 0,
      previousHash: null,
      transactions: [],
      timestamp: new Date().getTime()
    };
    const genesisBlockHash = this.hash(prospectGenesisBlock);
    const genesisBlockProof = proof.proofOfWork(genesisBlockHash, this.prefix);
    const genesisBlock = new Block(prospectGenesisBlock.index, prospectGenesisBlock.previousHash, genesisBlockProof, prospectGenesisBlock.transactions, prospectGenesisBlock.timestamp);
    return genesisBlock;
  }

  lastBlock() {
    if (this.chain.length > 0) {
      return this.chain[this.chain.length - 1];
    }
    return null;
  }

  newBlock(prospectBlock, prospectBlockProof) {
    const prospectBlockHash = this.hash(prospectBlock);
    if (proof.validProof(prospectBlockHash, prospectBlockProof, this.prefix)) {
      const newBlock = new Block(prospectBlock.index, prospectBlock.previousHash, prospectBlockProof, prospectBlock.transactions, prospectBlock.timestamp);
      this.chain.push(newBlock)
      return newBlock;
    }
    return null;
  }

  newTransaction(sender, recipient, amount) {
    this.currentTransactions.push(
      new Transaction(sender, recipient, amount)
    );
    const blockIndex = this.lastBlock().index + 1;
    // if (this.currentTransactions.length === this.blockSize) {
    //   this.addBlock();
    //   this.currentTransactions = [];
    // }
    return {
      currentBlockIndex: blockIndex,
      currentBlockLength: this.currentTransactions.length
    };
  }

  clearTransactions() {
    if (JSON.stringify(this.lastBlock().transactions) === JSON.stringify(this.currentTransactions)) {
      this.currentTransactions = [];
    }
  }
}

// const bc = new Blockchain();
// console.log(bc.hash(bc.lastBlock()));
// console.log(proof.validProof(
//   bc.hash(bc.lastBlock()), // hash
//   bc.lastBlock().proof, // proof
//   bc.prefix // prefix
// ));

module.exports = Blockchain;