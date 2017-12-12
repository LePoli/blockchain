const crypto = require('crypto');

/**
 * Signs a message with a given private key
 * 
 * @param {String} privateKey - PEM private key
 * @param {String} message 
 * 
 * @returns {String} hexadecimal string signature
 */
const sign = function (privateKey, message) {
  const signer = crypto.createSign('sha256');
  signer.update(message);
  signer.end();
  return signer.sign(privateKey).toString('hex');
};

/**
 * Verifies a valid signature
 * 
 * @param {String} publicKey PEM public key
 * @param {String} signature Hex string signature
 * @param {String} message 
 * 
 * @return {Boolean} vaidation
 */
const verify = function (publicKey, signature, message) {
  const verifier = crypto.createVerify('sha256');
  verifier.update(message);
  verifier.end();
  return verifier.verify(publicKey, Buffer.from(signature, 'hex'));
};

/**
 * Usage example
 */
/*const keypair = require('keypair');
const pair = keypair();
const private_key = pair.private;
const public_key = pair.public;
const message = 'Hola Mundo';

const signature = sign(private_key, message);
const verified = verify(public_key, signature, message);


console.log(JSON.stringify({
  message,
  signature,
  verified
}, null, 2));*/

module.exports = {
  sign,
  verify
};
