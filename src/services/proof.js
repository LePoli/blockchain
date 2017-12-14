const crypto = require('crypto');

const proofOfWork = (hash, prefix) => {
  let id = 0;
  let str = null;
  while (true) { // eslint-disable-line no-constant-condition
    const proof = id.toString(16);
    str = crypto.createHash('sha256').update(hash).update(proof).digest('hex');
    if (str.substring(0, prefix.length) === prefix) {
      console.log('intento #', id, str);
      return proof;
    }
    id += 1;
  }
};

const validProof = (hash, proof, prefix) => crypto
  .createHash('sha256')
  .update(hash)
  .update(proof)
  .digest('hex')
  .substring(0, prefix.length) === prefix;

module.exports = {
  proofOfWork,
  validProof
};
