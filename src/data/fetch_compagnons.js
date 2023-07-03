const fs = require('fs')

const LIMIT = 10;

/**
 * Fetch achievement-categories data from https://api.dofusdb.fr
 * run `npm run fetch` to refresh data
 */
module.exports = fetchCompagnons = (itms=[], skip=0) => {
    const items = require("./items.json");
    fs.writeFile(__dirname + "/compagnons.json", JSON.stringify(items.filter(i => i.typeId === 169).map(c => ({
        id: c.possibleEffects[0].value,
        name: c.name.replace("Signe de ", ""),
        img: '/img/items/' + c.iconId + '.png'
    }))), err => {
        if (err) {
            console.error(err);
            return;
        }
    });
}
