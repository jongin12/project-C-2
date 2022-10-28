// const timestamp = require("./timestamp.json");
// const match = require("./match.json");
const champion = require("./module/champion");
const queueId = require("./module/queueId");

const math = {
  matchData: (matchData) => {
    let data_num = matchData.length;
    let arr = {};
    let win = 0;
    for (let i = 0; i < data_num; i++) {
      let me = matchData[i].myNum;
      if (matchData[i].userinfo[me].win === true) {
        win++;
      }
    }
    arr.matchData = data_num;
    arr.win = win;
    return arr;
    // 총 경기 수와 그중 승리 수를 객체로 반환
  },
  goldDifference: (frames) => {
    let value = [];
    frames.forEach((item) => {
      var team1 = 0;
      for (let i = 1; i < 6; i++) {
        team1 += item.participantFrames[i].totalGold;
      }
      var team2 = 0;
      for (let i = 6; i < 11; i++) {
        team2 += item.participantFrames[i].totalGold;
      }
      value.push(team1 - team2);
    });
    return value;
    //1분당 골드차이 배열로 반환
  },
  deal_15min: (frames) => {
    if (frames.length > 15) {
      let value = [];
      let arr = frames[15].participantFrames;
      for (key in arr) {
        let dmg = arr[key].damageStats.totalDamageDoneToChampions;
        value.push(dmg);
      }
      return value;
    } else {
      return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    } // 가끔 15분 이전에 끝난 게임에서 오류 발생.
    //유저별로 15분 시점의 딜량 배열로 반환
  },
  deal_end: (frames) => {
    let value = [];
    let arr = frames[frames.length - 1].participantFrames;
    for (key in arr) {
      let dmg = arr[key].damageStats.totalDamageDoneToChampions;
      value.push(dmg);
    }
    return value;
    //유저별로 게임 종료 시점의 딜량 배열로 반환
  },
  eliteMonster_Kill: (frames) => {
    value = [];
    frames.forEach((item) => {
      let events = item.events;
      events.forEach((event) => {
        if (event.type === "ELITE_MONSTER_KILL") {
          value.push(event);
        }
      });
    });
    return value;
    //엘리트몬스터 처치로그 배열로 반환
  },
  Dragon_Kill: (frames) => {
    value = { team1: [], team2: [] };
    frames.forEach((item) => {
      let events = item.events;
      events.forEach((event) => {
        if (
          event.type === "ELITE_MONSTER_KILL" &&
          event.monsterType === "DRAGON" &&
          event.killerTeamId === 100
        ) {
          value.team1.push(event.monsterSubType);
        } else if (
          event.type === "ELITE_MONSTER_KILL" &&
          event.monsterType === "DRAGON" &&
          event.killerTeamId === 200
        ) {
          value.team2.push(event.monsterSubType);
        }
      });
    });
    return value;
    //엘리트몬스터(드래곤) 처치로그 배열로 반환
  },
  game_stats: (match) => {
    value = [
      { kda: { k: 0, d: 0, a: 0 }, gold: 0 },
      { kda: { k: 0, d: 0, a: 0 }, gold: 0 },
      {},
    ];
    let users = match.info.participants;
    let teams = match.info.teams;
    value[2].queueId = queueId[match.info.queueId];
    let gameEndTime = match.info.gameEndTimestamp;
    let date = new Date(gameEndTime);
    var year = date.getFullYear();
    var month = "0" + (date.getMonth() + 1);
    var day = "0" + date.getDate();
    var hour = "0" + date.getHours();
    var minute = "0" + date.getMinutes();
    value[2].gameEndTime =
      year +
      "-" +
      month.substr(-2) +
      "-" +
      day.substr(-2) +
      " " +
      hour.substr(-2) +
      ":" +
      minute.substr(-2);
    for (i = 0; i < 5; i++) {
      value[0].kda.k += users[i].kills;
      value[0].kda.d += users[i].deaths;
      value[0].kda.a += users[i].assists;
      value[0].gold += users[i].goldEarned;
      value[0].tower = teams[0].objectives.tower.kills;
      value[0].riftHerald = teams[0].objectives.riftHerald.kills;
      value[0].baron = teams[0].objectives.baron.kills;
      value[0].ban = [];
      teams[0].bans.forEach((item) => {
        if (item.championId !== -1) {
          let img = champion[item.championId].img;
          value[0].ban.push(img);
        }
      });
    }
    for (i = 5; i < 10; i++) {
      value[1].kda.k += users[i].kills;
      value[1].kda.d += users[i].deaths;
      value[1].kda.a += users[i].assists;
      value[1].gold += users[i].goldEarned;
      value[1].tower = teams[1].objectives.tower.kills;
      value[1].riftHerald = teams[1].objectives.riftHerald.kills;
      value[1].baron = teams[1].objectives.baron.kills;
      value[1].ban = [];
      teams[1].bans.forEach((item) => {
        if (item.championId !== -1) {
          let img = champion[item.championId].img;
          value[1].ban.push(img);
        }
      });
    }
    if (users[0].challenges) {
      value[0].elderdragon = users[0].challenges.teamElderDragonKills;
      value[1].elderdragon = users[5].challenges.teamElderDragonKills;
    }
    return value;
    //stats 객체 반환
  },
};

// console.log(math.game_stats(match));

// console.log(math.goldDifference(timestamp.info.frames));
// console.log(math.deal_15min(timestamp.info.frames));
// console.log(math.Dragon_Kill(timestamp.info.frames));

module.exports = math;
