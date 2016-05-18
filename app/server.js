/**
    Barebone script for starting a express server
**/

var express = require('express');
var http = require("http");
var port = process.env.PORT || 5000;
var app = express();
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
}); 
app.use('/src', express.static(__dirname + '/src'));
app.use('/lib', express.static(__dirname + '/lib'));
app.use('/assets', express.static(__dirname + '/assets'));

setInterval(function() {
    http.get("https://sfcard.herokuapp.com/");
}, 300000);

app.listen(port);
