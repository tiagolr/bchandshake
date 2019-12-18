/* eslint-disable */
require('dotenv').config()
const Handshake = require('../index')
const assert = require('assert')
const pkeyA = process.env.pkeyA
const pkeyB = process.env.pkeyB
const protocol =  '1LGLUS2khBGK4SSsYKezf218YH1vCUPkBS'
const fee = 2000

describe('bcevents', () => {
  it ('basic', async () => {
    const hshakeA = new Handshake({ pkey: pkeyA, protocol, fee })
    const hshakeB = new Handshake({ pkey: pkeyB, protocol, fee })
    let resA
    let resB

    hshakeB.onRequest(e => {
      e.accept()
      resA = e
    })

    resB = await hshakeA.request()

    assert(resA.payload.pub !== resB.payload.pub)
    assert(resA.sharedKey === resB.sharedKey)
  })
})
