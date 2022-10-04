const fs = require('fs')
const https = require('https');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const today = new Date();
const DAYS = 365;

/**
 * Fetch classes data from https://dofapi.fr and get classes images from https://s.ankama.com
 * run `npm run fetch` to refresh data
 */
module.exports = fetchAlmanax = (almanax = [], index = 0) => {
    if (index < DAYS) {
        let date = new Date();
        date.setDate(today.getDate() + index);
        const stringDate = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;

        console.log("https://www.krosmoz.com/fr/almanax/" + stringDate);
        https.get("https://www.krosmoz.com/fr/almanax/" + stringDate, (resp) => {
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received.
            resp.on('end', () => {
                const dom = new JSDOM(data);
                almanax.push({
                    "date": stringDate,
                    "merydes": dom.window.document.querySelector("#almanax_boss_desc .title")?.textContent,
                    "bonus": dom.window.document.querySelector("#achievement_dofus .mid")?.textContent.replaceAll("  ", "").replaceAll("\n\n", "").split("\n")[0],
                    "description": dom.window.document.querySelector("#achievement_dofus .more")?.textContent.replaceAll("  ", "").replaceAll("\n\n", "").split("\n")[1]
                });
                fetchAlmanax(almanax, index + 1);
            });
        }).on("error", (err) => {
            console.error(err.message);
        });
        
    } else {
        fs.writeFile(__dirname + "/" + "almanax.json", JSON.stringify(almanax), err => {
            if (err) {
                console.error(err);
                return;
            }
        })
    }
}