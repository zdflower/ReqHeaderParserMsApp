// server.js
// where your node app starts

function parseIP(str){
  //https://www.hacksparrow.com/node-js-get-ip-address.html
  var iparr = str.split(',');
  return iparr[0];
}

function parseReqLang(str){
  var strarr = str.split(";");
  return strarr[0];
}

//https://stackoverflow.com/questions/17779744/regular-expression-to-get-a-string-between-parentheses-in-javascript
/*
var regExp = /\(([^)]+)\)/;
var matches = regExp.exec("I expect five hundred dollars ($500).");

//matches[1] contains the value between the parentheses
console.log(matches[1]);
*/
function parseReqSoftw(str){
  var regExp = /\(([^)]+)\)/;
  var matches = regExp.exec(str);
  return matches[1];
}

function whoami(req){
  var ip = parseIP(req.header('x-forwarded-for') || req.connection.remoteAddress);
  var lang = parseReqLang(req.headers["accept-language"]);
  var software = parseReqSoftw(req.headers["user-agent"]);
  return {"ipaddress": ip, "language": lang, "software": software};
}


// init project
var express = require('express');
var app = express();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/api/whoami', function(req, res) {
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(whoami(req)));
  res.end();
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
