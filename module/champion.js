const championJson = require("./champion.json");

const champion = {};
for (key in championJson.data) {
  let a = championJson.data[key];
  let number = a.key;
  champion[number] = {
    name: a.name,
    img: `https://ddragon.leagueoflegends.com/cdn/12.18.1/img/champion/${a.image.full}`,
  };
}

module.exports = champion;
