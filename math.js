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
  },
  goldDifference: (frames) => {
    let value = [];
    frames.foreach((item) => {
      var team1 = 0;
      for (let i = 0; i < 5; i++) {
        team1 = +item.participantFrames[i].totalGold;
      }
      var team2 = 0;
      for (let i = 5; i < 10; i++) {
        team2 = +item.participantFrames[i].totalGold;
      }
      value.push(team1 - team2);
    });
    return value;
  },
};

module.exports = math;
