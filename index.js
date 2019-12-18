/* eslint-disable */
const Emitter = require('bcevents')
const crypto = require('crypto')
const bsv = require('bsv')

module.exports = function (opts = {
  pkey,   // private key for tx fees
  genKey, // private key to compute shared secret
  protocol,
} = {}) {
  opts.protocol = opts.protocol || '1ABWcS3AgAeXhMfUESpwuYWcLiaAAVu9Kj'
  this.genKey = opts.genKey ? bsv.PrivateKey(opts.genKey) : bsv.PrivateKey.fromRandom()
  this.pubKey = bsv.PublicKey.fromPrivateKey(this.genKey).toHex()
  this.genKey = this.genKey.toHex()

  this.request = () => new Promise((resolve, reject) => {
    const emitter = new Emitter(opts)
    const ecdh = crypto.createECDH('secp256k1')
    ecdh.setPrivateKey(this.genKey, 'hex')

    let reqTx
    emitter.once('res', e => {
      e.ecdh = ecdh
      e.reqTx = reqTx
      e.sharedKey = ecdh.computeSecret(e.payload.pub, 'hex', 'hex')
      emitter.close()
      resolve(e)
    })

    emitter.emit('req', { pub: this.pubKey } )
      .then(tx => { reqTx = tx })
      .catch(reject)
  })

  this.onRequest = (cb) => {
    const emitter = new Emitter(opts)
    const ecdh = crypto.createECDH('secp256k1')
    ecdh.setPrivateKey(this.genKey, 'hex')

    emitter.on('req', e => {
      const em = emitter
      e.ecdh = ecdh
      e.sharedKey = ecdh.computeSecret(e.payload.pub, 'hex', 'hex')
      e.accept = () => {
        return em.emit('res', { pub: this.pubKey })
      }
      emitter.close()
      cb(e)
    })
  }
}