const date1 = new Date(2022, 9, 5);
console.log(date1.getTime());

const timeset = (a) => {
  var now = new Date();
  var value = now - a;
  var hour = value / 1000 / 60 / 60;
};

timeset(date1.getTime());

//hour <1 hour*60 분 전
//Math.floor(hour)<24 => hour시간 전
//  >24 => hour/24 일 전
//  >24*30 => hour/24/30 달 전

const time = (unix) => {
  var now = new Date();
  var value = now - unix;
  var hour = value / 1000 / 60 / 60;
  return hour;
};

var aa = time(date1.getTime());

console.log(aa);
