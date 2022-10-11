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
};

module.exports = math;
