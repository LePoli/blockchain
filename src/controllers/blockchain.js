const blockchain = require('../services/blockchain');
const proof = require('../services/proof');

const getBlockchain = (req, res, next) => {
  try {
    res.status(200).json({
      chain: blockchain.chain,
      length: blockchain.chain.length,
      currentTransactions: blockchain.currentTransactions,
    });
  } catch (e) {
    next(e);
  }
};

const createTransaction = (req, res, next) => {
  try {
    const tx = blockchain.newTransaction(req.body.sender, req.body.recipient, req.body.amount);
    res.status(200).json(tx);
  } catch (e) {
    next(e);
  }
};

const getLastBlock = (req, res, next) => {
  try {
    res.status(200).json(blockchain.lastBlock());
  } catch (e) {
    next(e);
  }
};

const mineBlock = (req, res, next) => {
  try {
    // Mining fee
    blockchain.newTransaction(null, req.body.recipient, blockchain.fee);
    const lastBlock = blockchain.lastBlock();
    const previousHash = blockchain.hash(lastBlock);
    const prospectBlock = {
      index: lastBlock.index + 1,
      previousHash,
      transactions: blockchain.currentTransactions,
      timestamp: new Date().getTime()
    };
    const prospectBlockHash = blockchain.hash(prospectBlock);
    const prospectBlockProof = proof.proofOfWork(prospectBlockHash, blockchain.prefix);
    const newBlock = blockchain.newBlock(prospectBlock, prospectBlockProof);
    if (newBlock) {
      blockchain.clearTransactions();
      res.status(200).json(newBlock);
    } else {
      res.status(500).json({ message: 'Error mining block' });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getBlockchain,
  createTransaction,
  getLastBlock,
  mineBlock
};