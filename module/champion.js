const championJson = require("./champion.json");

const champion = {};
for (key in championJson.data) {
  let a = championJson.data[key];
  let number = a.key;
  champion[number] = a.name;
}

module.exports = champion;
