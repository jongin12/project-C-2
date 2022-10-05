const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const LOL_API = require("./LOL_API");
const ejs = require("ejs");
const { matchList } = require("./LOL_API");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/html"));

app.use("/process", express.static(__dirname + "/html"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/html/index.html");
});

app.get("/summoner/:name", async function (req, res) {
  let list = { matchlist: [] };
  let name = req.params.name;
  list.summoners = await LOL_API.summoners(req.params.name);
  list.league = await LOL_API.summonersLeague(list.summoners.id);
  list.matchList = await LOL_API.matchList(list.summoners.puuid);
  for (let i = 0; i < list.matchList.length; i++) {
    list.matchlist[i] = await LOL_API.matchInfo(list.matchList[i], name);
  }
  res.send(list);
  // LOL_API.summoners(req.params.name)
  //   .then((data) => (list.summoners = data))
  //   .then(() => LOL_API.summonersLeague(list.summoners.id))
  //   .then((data) => (list.league = data))
  //   .then(() => LOL_API.matchList(list.summoners.puuid))
  //   .then((data) => (list.matchList = data))
  // .then(() => LOL_API.matchInfo(list.matchList[0], req.params.name))
  // .then((data) => (list.matchlist[0] = data))
  // .then(() => res.send(list));

  // .then(() => {
  //   fs.readFile("html/search.ejs", "utf8", function (err, data) {
  //     res.writeHead(200, { "Content-Type": "text/html" });
  //     res.end(
  //       ejs.render(data, {
  //         searchData: list.matchlist[0],
  //         league: list.league,
  //       })
  //     );
  //   });
  // });
});

app.listen(8080, function () {
  console.log("server start..");
});
