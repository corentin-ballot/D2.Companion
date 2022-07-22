const fs = require('fs')
const https = require('https');



/**
 * Fetch monsters data from https://dofensive.com/api
 */
module.exports = fetchMonsters = () => {
    https.get("https://dofensive.com/api/dofus2/bestiary/monsters/preview?lang=fr", (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received.
        resp.on('end', () => {
            fs.writeFile(__dirname + "/monsters.json", data, err => {
                if (err) {
                    console.error(err);
                    return;
                }
            })

            // Load 4600+ imgs from dofensive
            getMonstersIcon(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.error(err.message);
    });
}

function getMonstersIcon(monsters, index = 0) {
    const file = fs.createWriteStream("public/img/monsters/" + monsters[index].Id);
    const request = https.get("https://dofensive.com/asset/dofensive/monsters/" + monsters[index].Id, function (response) {
        response.pipe(file);

        // after download completed close filestream
        file.on("finish", () => {
            file.close();
            if (index < monsters.length) getMonstersIcon(monsters, index + 1)
        });
    });
}