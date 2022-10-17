const timestamp = require("./timestamp.json");

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
    let value = [];
    let arr = frames[15].participantFrames;
    for (key in arr) {
      let dmg = arr[key].damageStats.totalDamageDoneToChampions;
      value.push(dmg);
    }
    return value;
    //유저별로 15분 시점의 딜량 배열로 반환
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
};

// console.log(math.goldDifference(timestamp.info.frames));
// console.log(math.deal_15min(timestamp.info.frames));
// console.log(math.eliteMonster_Kill(timestamp.info.frames));

module.exports = math;
