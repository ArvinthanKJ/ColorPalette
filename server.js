var express = require("express");
app = express();
var Auth = require("./controllers/auth");
var Color = require("./controllers/color");
var userID;
app.set("view engine", "ejs");
//app.engine('ejs', require('ejs').__express);

Auth(app);
Color(app);
app.use(express.static(__dirname + "/public"));

app.listen(3020, "127.0.0.1");
console.log("reading");
