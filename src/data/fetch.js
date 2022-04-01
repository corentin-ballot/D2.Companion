/**
 * Fetch equipments & weapons data from https://dofapi.fr
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
 * Fetch classes data from https://dofapi.fr and get classes images from https://s.ankama.com
 * run `npm run fetch` to refresh data
 */
https.get("https://fr.dofus.dofapi.fr/classes", (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received.
    resp.on('end', () => {
        data = JSON.parse(data);

        data.forEach((classe) => {
            ["male", "female"].forEach((sex) => {
                const file = fs.createWriteStream("public/img/classes/" + classe._id + "-" + sex + ".png");
                const request = https.get(classe[sex+"Img"].replace("https://s.ankama.com/www/static.ankama.com/dofus/renderer/look/", "https://static.ankama.com/dofus/renderer/look/"), function(response) {
                    response.pipe(file);

                    file.on("finish", () => {
                        file.close();
                    });
                });
            })
            
        });
    });

}).on("error", (err) => {
    console.error(err.message);
});

/**
 * Fetch monsters data from https://dofensive.com/api
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

        // Load 4600+ imgs from dofensive
        // getMonstersIcon();
    });

}).on("error", (err) => {
    console.error(err.message);
});

function getMonstersIcon(monsters, index=0) {
    const file = fs.createWriteStream("public/img/monsters/"+ monsters[index].Id);
    const request = https.get("https://dofensive.com/asset/dofensive/monsters/"+ monsters[index].Id, function(response) {
        response.pipe(file);
    
        // after download completed close filestream
        file.on("finish", () => {
            file.close();
            if(index < monsters.length) getMonstersIcon(monsters, index+1)
        });
    });
}