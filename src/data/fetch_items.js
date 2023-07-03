const fs = require('fs')
const https = require('https');
const Stream = require('stream').Transform;

const LIMIT = 10;

/**
 * Fetch achievement-categories data from https://api.dofusdb.fr
 * run `npm run fetch` to refresh data
 */
module.exports = fetchItems = (itms=[], skip=0) => {
    console.log(`https://api.beta.dofusdb.fr/items?$skip=${skip}&$sort=+id&lang=fr$limit=${LIMIT}`);
    https.get(`https://api.beta.dofusdb.fr/items?$skip=${skip}&$sort=+id&lang=fr$limit=${LIMIT}`, (resp) => {
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
                    typeId: item.typeId,
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
        const fileName = items[index].img.replace("https://api.beta.dofusdb.fr/img/items/", "");
        const file = "public/img/items/" + fileName;

        console.log(index + "/" + items.length, items[index].img);

        downloadImageToUrl(items[index].img, file, () => {getItemsIcon(items, index + 1)});
    } catch(e) {
        getItemsIcon(items, index + 1);
    }
}

var downloadImageToUrl = (url, filename, callback) => {
    if(fs.existsSync(filename)) {
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