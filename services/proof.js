const crypto = require('crypto');

const proofOfWork = function (hash, prefix) {
  let id = 0;
  let proof = null;
  let str = null;
  while (true) {
    proof = id.toString(16);
    str = crypto.createHash('sha256').update(hash).update(proof).digest('hex');
    if (str.substring(0, prefix.length) === prefix) {
      return proof;
    } else {
      id += 1;
    }
  }
};

const validProof = function (hash, proof, prefix) {
  return crypto.createHash('sha256').update(hash).update(proof).digest('hex').substring(0, prefix.length) === prefix;
};

module.exports = {
  proofOfWork,
  validProof
};