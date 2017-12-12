const express = require('express');
const router = express.Router();

const blockchainCtrl = require('../controllers/blockchain');

router.get('/', function (req, res, next) {
  blockchainCtrl.getBlockchain(req, res, next);
});

/**
 * Create new transaction
 */
router.post('/transactions', function (req, res, next) {
  if (req.body.sender && req.body.recipient && req.body.amount) {
    blockchainCtrl.createTransaction(req, res, next);
  } else {
    res.status(400).json({ message: 'invalid request body' });
  }
});

/**
 * Mine
 */
router.post('/mine', function (req, res, next) {
  if (req.body.recipient) {
    blockchainCtrl.mineBlock(req, res, next);
  } else {
    res.status(400).json({ message: 'invalid request body' });
  }
});

/**
 * Get last block
 */
router.get('/blocks/last', function (req, res, next) {
  blockchainCtrl.getLastBlock(req, res, next);
});

module.exports = router;
