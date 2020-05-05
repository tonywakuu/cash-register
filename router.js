var express = require('express')
const pug = require('pug')
var router = express.Router()

CashRegister = require('./models/cashregister.js')
var register = new CashRegister(10)

// our HTML front-page
router.get('/', function (req, res, next) {
  const index = pug.compileFile('./views/index.pug').call()
  res.send(index)
  next()
})

// `drawer` returns the current contents of the cash drawer in JSON
router.get('/drawer', function (req, res, next) {
  var output = new Object()
  output.quantities = register.drawer
  output.total = register.totalValue
  res.json(output)
  next()
})

// `transaction` makes change from the drawer
router.post('/transaction', function (req, res, next) {
  var payment = req.body.payment
  var price = req.body.price

  var transaction = register.transact(price,payment)

  if (transaction) {
    var output = new Object()
    output.quantities = transaction
    output.total = CashRegister.drawerTotal(transaction)
  } else {
    var output = false
  }

  res.json(output)
  next()
})

module.exports = router
