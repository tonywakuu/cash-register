var express = require('express')
var bodyParser = require('body-parser')
const router = require('./router.js')


app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'))
app.use(router)
app.listen(process.env.PORT || 3000)
