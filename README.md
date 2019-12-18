# bcevents

Establish a shared secret between two parties over the blockchain using ECDH (Elliptic-curve Diffie–Hellman).

## Install

```
npm install bchandshake datapay bsv
```

## Get Started

```js
// client
var Handshake = require('bchandshake')
var handshake = new Handshake({ pkey: 'privkey for tx fees' })
const res = await handshake.request()
console.log(res.sharedKey) // e4f56533a941d809.....

// oracle
var handshake = new Handshake({ pkey: 'privkey for tx fees' })
handshake.onRequest(req => {
  req.accept()  // completes the handshake
  console.log(req.sharedKey) // 'e4f56533a941d809.....
})
```

## Protocol

## Examples

### Encrypted ping-pong
// complete ping-pong example (use custom genKey, regenerate keys after each message)