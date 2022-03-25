/**
 * Fetch data from https://dofapi.fr
 * run `npm run fetch` to refresh data
 */

const fs = require('fs')
const https = require('https');
const api = "https://fr.dofus.dofapi.fr/";
const routes = ["equipments", "weapons"];


routes.forEach((route) => {
    https.get(api + route, (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received.
        resp.on('end', () => {
            fs.writeFile(__dirname + "/" + route + ".json", data, err => {
                if (err) {
                    console.error(err);
                    return;
                }
            })
        });

    }).on("error", (err) => {
        console.error(err.message);
    });

})


/**
 * Fetch data from https://dofensive.com/api
 */

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
    });

}).on("error", (err) => {
    console.error(err.message);
});
