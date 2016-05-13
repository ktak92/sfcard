var express = require('express');
var port = process.env.PORT || 5000;
var app = express();
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
}); 
app.use('/src', express.static(__dirname + '/src'));
app.use('/lib', express.static(__dirname + '/lib'));
app.use('/assets', express.static(__dirname + '/assets'));
app.listen(port);