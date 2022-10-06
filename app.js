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
  let list = { matchData: [] };
  let name = req.params.name;
  list.summoner = await LOL_API.summoners(req.params.name);
  list.league = await LOL_API.summonersLeague(list.summoner.id);
  list.matchList = await LOL_API.matchList(list.summoner.puuid);
  for (let i = 0; i < list.matchList.length; i++) {
    list.matchData[i] = await LOL_API.matchInfo(list.matchList[i], name);
  }
  // res.send(list);
  new Promise((resolve, reject) => {
    if (!list.matchList[0]) {
      reject();
    } else {
      resolve();
    }
  })
    .then(() => {
      fs.readFile("html/search.ejs", "utf8", function (err, data) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          ejs.render(data, {
            searchData: list.matchData,
            league: list.league,
            summoner: list.summoner,
          })
        );
      });
    })
    .catch((err) => {
      res.send("없는 소환사명입니다.");
    });
});

app.listen(8080, function () {
  console.log("server start..");
});
