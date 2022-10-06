const fetch = require("node-fetch");
const key = "RGAPI-9e8d0828-1bc8-48a1-aaff-02e80cacb721";
const queueId = require("./queueId");
const spell = require("./spell");
const rune = require("./rune");

const LOL_API = {
  summoners: (name) => {
    var url = `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${key}`;
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => resolve(data));
    });
  },
  summonersLeague: (id) => {
    var url = `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${key}`;
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => resolve(data));
    });
  },
  matchList: (puuid) => {
    var url = `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10&api_key=${key}`;
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => resolve(data));
    });
  },
  matchInfo: (matchid, name) => {
    var url = `https://asia.api.riotgames.com/lol/match/v5/matches/${matchid}?api_key=${key}`;
    return new Promise((resolve, reject) => {
      matchData = {};
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          let user = data.info.participants;
          let userinfo = user.map((item) => {
            return {
              summonerName: item.summonerName,
              puuid: item.puuid,
              championId: item.championId,
              championName: item.championName,
              champLevel: item.champLevel,
              teamPosition: item.teamPosition,
              summoner1Id: item.summoner1Id,
              summoner2Id: item.summoner2Id,
              perks: item.perks,
              kills: item.kills,
              deaths: item.deaths,
              assists: item.assists,
              gold: item.goldEarned,
              csJg: item.neutralMinionsKilled,
              csLine: item.totalMinionsKilled,
              win: item.win,
              controlWard: item.challenges.controlWardsPlaced,
              skillshotsDodged: item.challenges.skillshotsDodged,
              skillshotsHit: item.challenges.skillshotsHit,
              snowballsHit: item.challenges.snowballsHit,
              largestMultiKill: item.largestMultiKill,
              totalDamageDealtToChampions: item.totalDamageDealtToChampions,
              teamDamagePercentage: item.challenges.teamDamagePercentage,
              laneMinionsFirst10Minutes:
                item.challenges.laneMinionsFirst10Minutes,
              item: [
                item.item0,
                item.item1,
                item.item2,
                item.item3,
                item.item4,
                item.item5,
                item.item6,
              ],
            };
          });
          matchData.gameEndTimestamp = data.info.gameEndTimestamp;
          matchData.gameDuration = data.info.gameDuration;
          matchData.gameMode = data.info.gameMode;
          matchData.gameType = data.info.gameType;
          matchData.queueId = data.info.queueId;
          matchData.matchId = data.metadata.matchId;
          matchData.userinfo = userinfo;
        })
        .then(() => {
          var smallname = name.toLowerCase();
          var smallname2 = smallname.split(" ").join("");
          for (let i = 0; i < 10; i++) {
            var smalluser = matchData.userinfo[i].summonerName.toLowerCase();
            var smalluser2 = smalluser.split(" ").join("");
            if (smalluser2 === smallname2) {
              matchData.myNum = i;
            }
          }
          var quNum = matchData.queueId;
          var queueId_kr = queueId[quNum];
          matchData.queueId_kr = queueId_kr;

          for (let i = 0; i < 10; i++) {
            var spell1 = matchData.userinfo[i].summoner1Id;
            var spell2 = matchData.userinfo[i].summoner2Id;
            var summoner1Id_kr = spell[spell1];
            var summoner2Id_kr = spell[spell2];
            matchData.userinfo[i].summoner1Id_kr = summoner1Id_kr;
            matchData.userinfo[i].summoner2Id_kr = summoner2Id_kr;
          }

          for (let i = 0; i < 10; i++) {
            var runeNum =
              matchData.userinfo[i].perks.styles[0].selections[0].perk;
            var mainRune_kr = rune[runeNum];
            matchData.userinfo[i].mainRune_kr = mainRune_kr;
          }
        })
        .then(() => resolve(matchData));
    });
  },
  activeGame: (id) => {
    var url = `https://kr.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${id}?api_key=${key}`;
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => resolve(data));
    });
  },
};

// LOL_API.summoners("흰긴꼬리원숭이")
//   .then((data) => LOL_API.matchList(data.puuid))
//   .then((data) => LOL_API.matchInfo(data[0]))
//   .then((data) => console.log(data));

module.exports = LOL_API;
