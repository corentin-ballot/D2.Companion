const fs = require('fs')
const https = require('https');
const Stream = require('stream').Transform;

const LIMIT = 10;

/**
 * Fetch achievement-categories data from https://api.dofusdb.fr
 * run `npm run fetch` to refresh data
 */
module.exports = fetchItems = (itms=[], skip=0) => {
    const runeIds = [19342,19341,19340,19339,19338,19337,18724,18723,18722,18721,18720,18719,11666,11665,11664,11663,11662,11661,11660,11659,11658,11657,11656,11655,11654,11653,11652,11651,11650,11649,11648,11647,11646,11645,11644,11643,11642,11641,11640,11639,11638,11637,10662,10619,10618,10616,10615,10613,10057,7560,7508,7460,7459,7458,7457,7456,7455,7454,7453,7452,7451,7450,7449,7448,7447,7446,7445,7444,7443,7442,7438,7437,7436,7435,7434,7433,1558,1557,1556,1555,1554,1553,1552,1551,1550,1549,1548,1547,1546,1545,1525,1524,1523,1522,1521,1519];

    const items = require("./items.json");
    fs.writeFile(__dirname + "/runes-forgemagie.json", JSON.stringify(items.filter(i => runeIds.includes(i._id))), err => {
        if (err) {
            console.error(err);
            return;
        }
    })

    return;
    console.log(`https://api.dofusdb.fr/items?$skip=${skip}&$sort=+id&lang=fr`);
    https.get(`https://api.dofusdb.fr/items?$skip=${skip}&$sort=+id&lang=fr`, (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received.
        resp.on('end', () => {
            data = JSON.parse(data);
            
            data.data = data.data.map(item => {
                return {
                    _id: item.id,
                    name: item.name?.fr,
                    level: item.level,
                    iconId: item.iconId,
                    effects: item.effects,
                    possibleEffects: item.possibleEffects,
                    type: item.type?.fr,
                    img: item.img
                }
            });
            const items = [...itms, ...data.data];

            if(data.total <= (skip + LIMIT)) {
                fs.writeFile(__dirname + "/items.json", JSON.stringify(items), err => {
                    if (err) {
                        console.error(err);
                        return;
                    } else {
                        getItemsIcon(items);
                    }
                })
            } else {
                fetchItems(items, skip+LIMIT);
            }
        });

    }).on("error", (err) => {
        console.error(err.message);
    });
}

function getItemsIcon(items, index = 0) {
    if(!items[index]) return;

    try {
        const fileName = items[index].img.replace("https://api.dofusdb.fr/img/items/", "");
        const file = "public/img/items/" + fileName;
    
        console.log(index + "/" + items.length, items[index].img);
    
        downloadImageToUrl(items[index].img, file, () => {getItemsIcon(items, index + 1)});
    } catch(e) {
        getItemsIcon(items, index + 1);
    }
}

let downloaded = [];
var downloadImageToUrl = (url, filename, callback) => {
    if(downloaded.includes(url)) {
        callback();
    } else {
        https.request(url, function(response) {                                        
        var data = new Stream();                                                    

        response.on('data', function(chunk) {                                       
            data.push(chunk);                                                         
        });                                                                         

        response.on('end', function() {                                             
            fs.writeFileSync(filename, data.read());
            callback();                          
        });                                                                         
    }).end();
    }
};