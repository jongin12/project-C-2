const runeJson = require("./rune.json");

let rune = {};

for (let i = 0; i < runeJson.length; i++) {
  for (let j = 0; j < runeJson[i].slots.length; j++) {
    for (let k = 0; k < runeJson[i].slots[j].runes.length; k++) {
      arr = runeJson[i].slots[j].runes[k];
      rune[arr.id] = {
        name: arr.name,
        img: "https://ddragon.leagueoflegends.com/cdn/img/" + arr.icon,
      };
    }
  }
}

module.exports = rune;
