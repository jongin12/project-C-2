import fetch from "node-fetch";

const key = "RGAPI-f568e047-e143-4dca-a80f-26a05d2bc1f6";

const LOL_API = {
  summoners: (name) => {
    var url = `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${key}`;
    return fetch(url);
  },
  matchList: (puuid) => {
    var url = `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${key}`;
    return fetch(url);
  },
  matchInfo: (matchid) => {
    var url = `https://asia.api.riotgames.com/lol/match/v5/matches/${matchid}?api_key=${key}`;
    return fetch(url);
  },
};

LOL_API.summoners("흰긴꼬리원숭이")
  .then((response) => response.json())
  .then((data) => LOL_API.matchList(data.puuid))
  .then((response) => response.json())
  .then((data) => LOL_API.matchInfo(data[0]))
  .then((response) => response.json())
  .then((data) => data.info.participants)
  .then((data) =>
    data.map((item) => {
      return {
        summonerName: item.summonerName,
        summonerId: item.summonerId,
        puuid: item.puuid,
        role: item.role,
      };
    })
  )
  .then((data) => console.log(data));
