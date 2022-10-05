const fetch = require("node-fetch");
const key = "RGAPI-1772bfed-1c4c-4f24-9536-081c9f237fa7";

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
              kills: item.kills,
              deaths: item.deaths,
              assists: item.assists,
              gold: item.goldEarned,
              controlWard: item.challenges.controlWardsPlaced,
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
          endTime = new Date(data.info.gameEndTimestamp);
          krTime = endTime.toString();
          matchData.gameEndTimestamp = krTime;
          matchData.gameDuration = data.info.gameDuration;
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
