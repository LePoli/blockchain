const crypto = require('crypto');

class Transaction {
  constructor(sender, recipient, amount) {
    this._sender = sender;
    this._recipient = recipient;
    this._amount = amount;
    this._timestamp = new Date().getTime();
  }
}

module.exports = Transaction;