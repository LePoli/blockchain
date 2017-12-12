const Blockchain = require('../structs/Blockchain');

class BlockchainService {
  constructor() {
    this.blockchainInstance = null;
  }

  getInstance() {
    if (!this.blockchainInstance) {
      this.blockchainInstance = new Blockchain();
    }
    return this.blockchainInstance;
  }
}

const singleton = new BlockchainService();

module.exports = singleton.getInstance();
