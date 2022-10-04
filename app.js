const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const LOL_API = require("./LOL_API");
const ejs = require("ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/html"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/html/index.html");
});

app.get("/summoner", function (req, res) {
  res.writeHead(302, { Location: "http://www.google.com" });
});

app.get("/summoner/:puuid", function (req, res) {
  LOL_API.summoners(req.params.puuid)
    .then((data) => LOL_API.matchList(data.puuid))
    .then((data) => {
      LOL_API.matchInfo(data[0]);
    })
    .then((data) => res.send(data));
});

app.listen(8080, function () {
  console.log("server start..");
});
