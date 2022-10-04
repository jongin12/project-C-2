const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const LOL_API = require("./LOL_API");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.send("main");
});

app.get("/summoner/:puuid", function (req, res) {
  LOL_API.summoners(req.params.puuid)
    .then((data) => LOL_API.matchList(data.puuid))
    .then((data) => LOL_API.matchInfo(data[4]))
    .then((data) => res.send(data));
});

app.listen(8080, function () {
  console.log("server start..");
});
