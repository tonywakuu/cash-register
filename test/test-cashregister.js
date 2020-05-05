var _ = require('lodash')
var chai = require('chai')
var assert = chai.assert;
const config = require('../config.js')
const CashRegister = require('../models/cashregister.js')

describe('CashRegister:', function() {
  it('initializes with the appropriate amount in the drawer', function(){
    const initialDrawer = 4
    var register = new CashRegister(initialDrawer)
    var expectedTotal = _(config.bills)
                        .map(n => n * initialDrawer)
                        .sum()
    assert.equal(register.totalValue, expectedTotal)
  })

  describe('In a successful transaction', function() {
    const initialDrawer = 10
    const price = 23
    const payment = 100

    var register = new CashRegister(initialDrawer)
    var initialTotal = register.totalValue
    var transaction = register.transact(price, payment)
    var changeValue = CashRegister.drawerTotal(transaction)

    it ('returns correct change', function(){
      assert.equal(changeValue, (payment - price))
    })

    it ('correctly updates the drawer', function(){
      var expectedTotal = initialTotal + payment - changeValue
      assert.equal(register.totalValue, expectedTotal)
    })
  })

  describe('In a transaction with no dimes in the drawer', function(){
    var register = new CashRegister(0)
    register.addOne(5)
    register.addOne(5)
    register.addOne(1)

    const price = 89
    const payment = 100

    var transaction = register.transact(price, payment)

    it ('returns change using nickels', function(){
      assert.equal(transaction[5], 2)
      assert.equal(transaction[10], 0)
    })
  })

  describe('In a transaction with insufficient funds in the drawer', function(){
    const price = 100000
    const payment = 90000
    var register = new CashRegister(1)
    assertInvalidTransaction(register,price,payment)
  })

  describe('In a transaction with insufficient change in the drawer', function(){
    const price = 99
    const payment = 100

    var register = new CashRegister(0)
    register.addOne(2000)

    assertInvalidTransaction(register,price,payment)
  })

  describe('In a transaction with an insufficient payment', function(){
    const price = 200
    const payment = 100
    var register = new CashRegister(10)
    assertInvalidTransaction(register,price,payment)
  })

  describe('In a transaction with a negative payment', function(){
    const price = 100
    const payment = -100
    var register = new CashRegister(10)
    assertInvalidTransaction(register,price,payment)
  })

  describe('In a transaction with a negative price', function(){
    const price = -100
    const payment = 100
    var register = new CashRegister(10)
    assertInvalidTransaction(register,price,payment)
  })

})

function assertInvalidTransaction(register,price,payment){
  var initialTotal = register.totalValue
  var transaction = register.transact(price, payment)

  it ('returns an error', function(){
    assert.isNotOk(transaction)
  })

  it ('does not modify the drawer', function(){
    assert.equal(register.totalValue, initialTotal)
  })
}
