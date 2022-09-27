const fs = require('fs')
const https = require('https');

const QC_LIMIT = 10;

/**
 * Fetch achievement-categories data from https://api.dofusdb.fr
 * run `npm run fetch` to refresh data
 */
module.exports = fetchQuestsCategories = (ac=[], skip=0) => {
    console.log(`https://api.dofusdb.fr/quest-categories?$skip=${skip}&$sort=order&lang=fr`);
    https.get(`https://api.dofusdb.fr/quest-categories?$skip=${skip}&$sort=order&lang=fr`, (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received.
        resp.on('end', () => {
            data = JSON.parse(data);
            const quest_categories = [...ac, ...data.data];

            if(data.total <= (skip + QC_LIMIT)) {
                fs.writeFile(__dirname + "/quest-categories.json", JSON.stringify(quest_categories), err => {
                    if (err) {
                        console.error(err);
                        return;
                    } else {
                        fetchQuests();
                    }
                })
            } else {
                fetchQuestsCategories(quest_categories, skip+QC_LIMIT);
            }
        });

    }).on("error", (err) => {
        console.error(err.message);
    });
}

const Q_LIMIT = 50;

fetchQuests = (a=[], skip=0) => {
    console.log(`https://api.dofusdb.fr/quests?$skip=${skip}&$populate=false&$limit=${Q_LIMIT}&$sort=-id&lang=fr`);
    https.get(`https://api.dofusdb.fr/quests?$skip=${skip}&$populate=false&$limit=${Q_LIMIT}&$sort=-id&lang=fr`, (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received.
        resp.on('end', () => {
            data = JSON.parse(data);
            const quests = [...a, ...data.data];
            console.log(skip+Q_LIMIT + "/" + data.total)

            if(data.total <= (skip + Q_LIMIT)) {
                fs.writeFile(__dirname + "/quests.json", JSON.stringify(quests), err => {
                    if (err) {
                        console.error(err);
                        return;
                    } else {
                        console.log("OK");
                    }
                })
            } else {
                fetchQuests(quests, skip+Q_LIMIT);
            }
        });

    }).on("error", (err) => {
        console.error(err.message);
    });
}