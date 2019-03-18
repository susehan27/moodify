require('dotenv').config();

var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
//var http = require("http");
var cors = require('cors');

app.use(cors());
var port = process.env.PORT || 8080;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// var SpotifyWebApi = require('spotify-web-api-node');

// // The API object we'll use to interact with the API
// var spotifyApi = new SpotifyWebApi({
//   clientId : process.env.CLIENTID_KEY,
//   clientSecret : process.env.SECRET_KEY
// });

// // Using the Client Credentials auth flow, authenticate our app
// spotifyApi.clientCredentialsGrant()
//     .then(function(data) {
  
//     // Save the access token so that it's used in future calls
//     spotifyApi.setAccessToken(data.body['access_token']);
//     console.log("Token received!");
  
//     }, function(err) {
//     console.log('Something went wrong when retrieving an access token', err.message);
// });

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
    console.log("Server is running on port " + port);
});

// module.exports = {
//     subscriptionKey: subscriptionKey,
//     clientId: clientId,
//     secret: secret
// }