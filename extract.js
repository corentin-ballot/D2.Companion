const fs = require('fs')
const items = require("./src/data/items.json");

const items200 = items.filter(item => item.level === 200 && item.possibleEffects.length > 2).map(item => item.name);

fs.writeFile(__dirname + "/items200.json", JSON.stringify(items200), err => {
    if (err) {
        console.error(err);
        return;
    }
})
