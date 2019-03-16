var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/app", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index2.html"));
})

app.get("/about", function(req, res) {
    res.sendFile(path.join(__dirname, "public/about.html"));
});

app.get("/help", function(req, res) {
    res.sendFile(path.join(__dirname, "public/help.html"));
});

app.listen(port, function() {
    console.log("Server is running on " + port + "port");
});

