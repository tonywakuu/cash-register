var _ = require('lodash')
const config = require('../config.js')

// Constructor
// Initialize drawer
var CashRegister = function(initialDrawer){
  var initialDrawer = initialDrawer || 0
  this.drawer = new Map()
  config.bills.forEach((bill) => {this.drawer[bill] = initialDrawer})
  this.updateTotal()
}

// Define currency
CashRegister.currencyType = function(value, currencyType){
  var remaining = value

  config.bills.forEach(function(bill){
    while (remaining >= bill){
      currencyType[bill]++
      remaining -= bill
    }
  })
}

 // Calcuate drawer total
CashRegister.drawerTotal = (drawer) => {
  return _(drawer).map(_.multiply).sum()
}

 // Trasaction Handler
CashRegister.prototype.transact = function(price, payment){
  if ((price < 0) || (payment < 0) || (payment-price <= 0)){ return false }

  // create copy of the drawer 
  var backupDrawer = _.clone(this.drawer)

  // add the payment to the drawer
  CashRegister.currencyType(payment, backupDrawer)

  // create an empty map of bills
  var billMap = new Map()
  config.bills.forEach((bill) => {billMap[bill] = 0})

  // attempt to make change (under $1000)
  var remaining = payment - price
  config.bills.forEach(bill => {
    while ((remaining >= bill) && (backupDrawer[bill] > 0)){
      backupDrawer[bill]--
      billMap[bill]++
      remaining -= bill
    }
  })
  var totalChange = CashRegister.drawerTotal(billMap)
  console.log(totalChange)
  if (totalChange == (payment - price)){
    this.drawer = backupDrawer
    // save iff successful
    this.updateTotal()
    return billMap
  } else {
    return false
  }
}

CashRegister.prototype.updateTotal = function(){
  this.totalValue = CashRegister.drawerTotal(this.drawer)
}

// Add single bill to drawer
CashRegister.prototype.addOne = function(bill){
  this.drawer[bill]++
  this.updateTotal()
}

module.exports = CashRegister
