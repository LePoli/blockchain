const blockchain = require('../services/blockchain');
const proof = require('../services/proof');

const getBlockchain = (req, res, next) => {
  try {
    res.status(200).json(blockchain);
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

const registerNode = (req, res, next) => {
  try {
    const node = blockchain.registerNode(req.body.address);
    if (node) {
      res.status(200).json(node);
    } else {
      res.status(302).json({ message: 'Node already registered' });
    }
  } catch (e) {
    next(e);
  }
};

const resolveConflict = (req, res, next) => {
  try {
    blockchain.resolveConflicts().then((replaced) => {
      if (replaced) {
        res.status(200).json({
          message: 'Our chain was replaced',
          newChain: blockchain.chain
        });
      } else {
        res.status(200).json({
          message: 'Our chain is on sync',
          newChain: blockchain.chain
        });
      }
    }).catch(next);
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
  mineBlock,
  registerNode,
  resolveConflict
};
