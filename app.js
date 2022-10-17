const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const LOL_API = require("./LOL_API");
const ejs = require("ejs");
const math = require("./math");
const { activeGame } = require("./LOL_API");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/html"));

app.use("/process", express.static(__dirname + "/html"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/html/index.html");
});

app.get("/list/:name", async function (req, res) {
  let list = { matchData: [] };
  let name = req.params.name;
  list.summoner = await LOL_API.summoners(req.params.name);
  list.activeGame = await LOL_API.activeGame(list.summoner.id);
  list.league = await LOL_API.summonersLeague(list.summoner.id);
  list.matchList = await LOL_API.matchList(list.summoner.puuid);
  for (let i = 0; i < list.matchList.length; i++) {
    list.matchData[i] = await LOL_API.matchInfo(list.matchList[i], name);
  }
  list.math = math.matchData(list.matchData);
  res.send(list);
});

app.get("/summoner/:name", async function (req, res) {
  let list = { matchData: [] };
  let name = req.params.name;
  list.summoner = await LOL_API.summoners(req.params.name);
  list.activeGame = await LOL_API.activeGame(list.summoner.id);
  list.league = await LOL_API.summonersLeague(list.summoner.id);
  list.matchList = await LOL_API.matchList(list.summoner.puuid);
  for (let i = 0; i < list.matchList.length; i++) {
    list.matchData[i] = await LOL_API.matchInfo(list.matchList[i], name);
  }
  list.math = math.matchData(list.matchData);
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
            math: list.math,
            activeGame: list.activeGame,
          })
        );
      });
    })
    .catch(() => {
      res.send("없는 소환사명입니다.");
    });
});

app.get("/summoner/:name/activegame", async function (req, res) {
  let list = { userInfo: [] };
  list.summoner = await LOL_API.summoners(req.params.name);
  list.activeGame = await LOL_API.activeGame(list.summoner.id);
  if (!list.activeGame.status) {
    for (let i = 0; i < 10; i++) {
      var userId = list.activeGame.participants[i].summonerId;
      list.userInfo[i] = await LOL_API.summonersLeague(userId);
    }
  }
  new Promise((resolve, reject) => {
    if (list.summoner.status) {
      reject("없는 소환사명입니다.");
    } else if (list.activeGame.status) {
      reject("진행중인 게임이 없습니다.");
    } else {
      resolve();
    }
  })
    .then(() => {
      fs.readFile("html/active-game.ejs", "utf8", function (err, data) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          ejs.render(data, {
            Data: list.activeGame,
            User: list.userInfo,
          })
        );
      });
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/match/:id", async function (req, res) {
  let list = { user: [], math: {} };
  list.match = await LOL_API.matchInfo(req.params.id, "name");
  list.timeLine = await LOL_API.timeLine(req.params.id);
  for (let i = 0; i < 10; i++) {
    let userId = list.match.userinfo[i].summonerId;
    list.user[i] = await LOL_API.summonersLeague(userId);
  }
  list.math.deal_15min = math.deal_15min(list.timeLine.info.frames);
  list.math.eliteMonster_Kill = math.eliteMonster_Kill(
    list.timeLine.info.frames
  );
  list.math.goldDifference = math.goldDifference(list.timeLine.info.frames);
  res.send(list);
  // new Promise((resolve, reject) => {
  //   if (list.status) {
  //     reject("없는 matchId입니다");
  //   } else {
  //     resolve();
  //   }
  // })
  //   .then(() => {
  //     fs.readFile("html/match-info.ejs", "utf8", function (err, data) {
  //       res.writeHead(200, { "Content-Type": "text/html" });
  //       res.end(
  //         ejs.render(data, {
  //           matchData: list.match,
  //           userData: list.user,
  //         })
  //       );
  //     });
  //   })
  //   .catch((err) => {
  //     res.send(err);
  //   });
});

app.listen(8080, function () {
  console.log("server start..");
});
