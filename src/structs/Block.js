class Block {
  constructor(index, previousHash, proof, transactions, timestamp) {
    this.index = index;
    this.previousHash = previousHash;
    this.proof = proof;
    this.transactions = transactions;
    this.timestamp = timestamp;
  }
}

module.exports = Block;
