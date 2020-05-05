// define utility functions
var app = new Object();

app.formatTransaction = function(bundleData, header){
  const currencyFormatter = new Intl.NumberFormat("en-US", {minimumFractionDigits: 2});
  const quantityFormatter = new Intl.NumberFormat("en-US");

  var quantityNames = {
    2000: "Twenty-dollar bills",
    1000: "Ten-dollar bills",
    500: "Five-dollar bills",
    100: "One-dollar bills",
    50: "Fifty-cent coins",
    25: "Quarters",
    10: "Dimes",
    5: "Nickels",
    1: "Pennies"
  }

  var total = currencyFormatter.format((bundleData['total']/100));
  var output = `<h3>${header} $${total}</h3>`
  output += "<ul>"
  _(quantityNames).forEach(function(name,bill){
    var q = quantityFormatter.format(bundleData['quantities'][bill])
    output += `<li><strong>${name}:</strong> ${q}</li>`
  })
  output += "</ul>"

  return output
}

// fetch and display the current cash drawer
app.displayDrawer = function(){
  $.ajax({url:"/drawer"})
   .done(function(drawerData){
    var drawerHTML = app.formatTransaction(drawerData, "The cash register contains")
    $("#drawer").html(drawerHTML)
  })
}

$( document ).ready(function() {
  // fetch and display the current cash drawer
  app.displayDrawer()

  $('.currency').autoNumeric('init', { currencySymbol : '$', minimumValue: 0 });

  // trigger the transaction
  $("#submit").click(function(e){
    var payment = $("#payment").val() * 100
    var price = $("#price").val() * 100
    var data = {"payment":payment,"price":price}
    $.ajax({url:"/transaction", method:"POST", data})
     .done(function(changeData){
      if (changeData){
        // the transaction succeeded
        var changeHTML = app.formatCashBundle(changeData, "Success: Your change is")
        $("#change").html(changeHTML)
      } else {
        // the transaction failed
        $("#change").html("That transaction didn't work.")
      }

      // refresh the cash drawer and the form
      app.displayDrawer()
      $("#payment").val("")
      $("#price").val("")
    })
  })
})
