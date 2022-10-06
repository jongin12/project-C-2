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

var now = new Date();
var value = now - date1.getTime();
// var hour = value / 1000 / 60 / 60;
var hour = 0.6;
var time = "";
if (hour >= 24) {
  time = Math.floor(hour / 24);
  time = time + "일 전";
} else if (24 > hour && hour >= 1) {
  time = Math.floor(hour);
  time = time + "시간 전";
} else if (1 > hour) {
  time = Math.floor(hour * 60);
  time = time + "분 전";
}

console.log(time);
