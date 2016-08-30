/**
 *  Server Node.js of Conquer Game 
 *  @author Jesus Juan Aguilar
 *  @version 0.0.4
 *  @date 05/2016
 */

var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var app = express();
var port = (process.env.PORT || process.env.VCAP_APP_PORT || 3000);

app.use(helmet());
app.use(express.static(__dirname + '/public'));
app.use( bodyParser.json() );  
app.use(bodyParser.urlencoded({     
  extended: true
}));


app.listen(port);
console.log("Server listening on 3000");

