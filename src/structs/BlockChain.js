const crypto = require('crypto');
const Transaction = require('./Transaction');
const Block = require('./Block');
const proof = require('../services/proof');
const request = require('request');

class Blockchain {
  constructor(prefix, fee) {
    this.prefix = prefix || '00000';
    this.fee = fee || 1;
    this.chain = [];
    this.currentTransactions = [];
    this.nodes = [];
    this.chain.push(this.genesisBlock());
  }

  registerNode(address) {
    const id = address.toLowerCase();
    if (this.nodes.join(' ').indexOf(id) === -1) {
      this.nodes.push(id);
      return { id };
    }
    return null;
  }

  validChain(neighbourChain) {
    let currentIndex = 1;
    let previousBlock = neighbourChain[0];
    while (currentIndex < neighbourChain.length) {
      const currentBlock = neighbourChain[currentIndex];
      if (currentBlock.previousHash !== this.hash(previousBlock)) {
        return false;
      }
      if (!proof.validProof(this.hash(currentBlock), currentBlock.proof, this.prefix)) {
        return false;
      }
      if (!proof.validProof(this.hash(currentBlock), currentBlock.proof, this.prefix)) {
        return false;
      }
      previousBlock = currentBlock;
      currentIndex += 1;
    }
    return true;
  }

  resolveConflicts() {
    return new Promise((resolve, reject) => {
      let maxLength = this.chain.length;
      let newChain = null;
      if (this.nodes.length <= 0) {
        reject(new Error('No nodes in the network'));
      } else {
        this.nodes.forEach((node, index) => {
          request({
            url: `http://${node}/blockchain`,
            headers: {
              'Content-Type': 'application/json'
            }
          }, (error, response, body) => {
            if (response && response.statusCode === 200 && JSON.parse(body).chain) {
              const remoteBlockchain = JSON.parse(body);
              const currentNodeChain = remoteBlockchain.chain;
              if (currentNodeChain.length > maxLength && this.validChain(currentNodeChain)) {
                maxLength = currentNodeChain.length;
                newChain = currentNodeChain;
              }
              if (newChain && index === this.nodes.length - 1) {
                this.chain = newChain;
                resolve(true);
              } else {
                resolve(false);
              }
            } else {
              reject(new Error('Invalid response'));
            }
          });
        });
      }
    });
  }

  hash(block) { // eslint-disable-line class-methods-use-this
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
    const genesisBlock = new Block(
      prospectGenesisBlock.index,
      prospectGenesisBlock.previousHash,
      genesisBlockProof,
      prospectGenesisBlock.transactions,
      prospectGenesisBlock.timestamp
    );
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
      const newBlock = new Block(
        prospectBlock.index,
        prospectBlock.previousHash,
        prospectBlockProof,
        prospectBlock.transactions,
        prospectBlock.timestamp
      );
      this.chain.push(newBlock);
      return newBlock;
    }
    return null;
  }

  newTransaction(sender, recipient, amount) {
    this.currentTransactions.push(new Transaction(sender, recipient, amount));
    const blockIndex = this.lastBlock().index + 1;
    return {
      currentBlockIndex: blockIndex,
      currentBlockLength: this.currentTransactions.length
    };
  }

  clearTransactions() {
    const txs = this.lastBlock().transactions;
    if (JSON.stringify(txs) === JSON.stringify(this.currentTransactions)) {
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
