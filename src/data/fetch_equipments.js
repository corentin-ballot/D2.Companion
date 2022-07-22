/**
 * Fetch equipments & weapons data from https://dofapi.fr
 * run `npm run fetch` to refresh data
 */

const fs = require('fs')
const https = require('https');
const api = "https://fr.dofus.dofapi.fr/";
const routes = ["equipments", "weapons"];
const Stream = require('stream').Transform;

module.exports = fetchEquipments = () => {
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

                getEquipmentIcon(JSON.parse(data));
            });

        }).on("error", (err) => {
            console.error(err.message);
        });

    });
}

function getEquipmentIcon(equipments, index = 0) {
    if(!equipments[index]) return;
    const fileName = equipments[index].imgUrl.replace("https://s.ankama.com/www/static.ankama.com/dofus/www/game/items/200/", "")
    const file = "public/img/equipments/" + fileName;

    console.log(equipments[index].imgUrl);

    downloadImageToUrl("https://static.ankama.com/dofus/www/game/items/200/" + fileName, file, () => {getEquipmentIcon(equipments, index + 1)});
}

var downloadImageToUrl = (url, filename, callback) => {
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
};