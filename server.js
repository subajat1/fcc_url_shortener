'use strict';

var express = require('express');
var mongo = require('mongodb');
// var mongoose = require('mongoose');
try{
  var mongoose = require('mongoose');
} catch (e) {
  console.log(e);
}
/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGOLAB_URI);
const Schema = mongoose.Schema;

var dns = require('dns');


var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;


app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: 'false'}));
app.use(bodyParser.json());


app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/mongo-connection", function (req, res) {
    if (mongoose) {
    res.json({isMongooseOk: !!mongoose.connection.readyState})
  } else {
    res.json({isMongooseOk: false})
  }
});

const urlSchema = new Schema({
  url: { type: String, required: true },
  hash: { type: String, required: true }
});

var Url = mongoose.model("Url", urlSchema);

var sha1 = require('sha1');


app.post("/api/shorturl/new", function(req, res) {
  var url = new Url(req.body);
  dns.lookup(url.url, function (err, address, family) {
    res.json({
      'url': url.url, 
      'hash': sha1(url.url)
    });
  })
  
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});