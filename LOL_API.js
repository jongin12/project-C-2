const fetch = require("node-fetch");
const key = "RGAPI-9e8d0828-1bc8-48a1-aaff-02e80cacb721";

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
          matchData.gameType = data.info.gameType;
          matchData.gameMode = data.info.gameMode;
          matchData.userinfo = userinfo;
        })
        .then(() => {
          for (let i = 0; i < 10; i++) {
            if (matchData.userinfo[i].summonerName === name) {
              matchData.myNum = i;
            }
          }
        })
        .then(() => resolve(matchData));
    });
  },
};

// LOL_API.summoners("흰긴꼬리원숭이")
//   .then((data) => LOL_API.matchList(data.puuid))
//   .then((data) => LOL_API.matchInfo(data[0]))
//   .then((data) => console.log(data));

module.exports = LOL_API;
