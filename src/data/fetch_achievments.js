const fs = require('fs')
const https = require('https');
const Stream = require('stream').Transform;

const LIMIT = 50;

/**
 * Fetch achievement-categories data from https://api.dofusdb.fr
 * run `npm run fetch` to refresh data
 */
module.exports = fetchAchievmentCategories = (ac=[], skip=0) => {
    https.get(`https://api.beta.dofusdb.fr/achievement-categories?$skip=${skip}&$limit=${LIMIT}&$sort=parentId&$select[]=name&$select[]=order&$select[]=parentId&$select[]=achievementIds&$select[]=id&$select[]=icon&$populate=false&lang=fr`, (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received.
        resp.on('end', () => {
            data = JSON.parse(data);
            const achievement_categories = [...ac, ...data.data];

            if(data.total <= (skip + LIMIT)) {
                fs.writeFile(__dirname + "/achievement-categories.json", JSON.stringify(achievement_categories), err => {
                    if (err) {
                        console.error(err);
                        return;
                    } else {
                        fetchAchievments();
                    }
                })
            } else {
                fetchAchievmentCategories(achievement_categories, skip+LIMIT);
            }
        });

    }).on("error", (err) => {
        console.error(err.message);
    });
}

fetchAchievments = (a=[], skip=0) => {
    https.get(`https://api.beta.dofusdb.fr/achievements?$skip=${skip}&$populate=false&$limit=${LIMIT}&lang=fr`, (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received.
        resp.on('end', () => {
            data = JSON.parse(data);
            const achievements = [...a, ...data.data];
            console.log(skip+LIMIT + "/" + data.total)

            if(data.total <= (skip + LIMIT)) {
                fs.writeFile(__dirname + "/achievements.json", JSON.stringify(achievements), err => {
                    if (err) {
                        console.error(err);
                        return;
                    } else {
                        console.log("Images : ");
                        getAchievementsIcon(achievements);
                    }
                })
            } else {
                fetchAchievments(achievements, skip+LIMIT);
            }
        });

    }).on("error", (err) => {
        console.error(err.message);
    });
}

function getAchievementsIcon(achievements, index = 0) {
    if(!achievements[index]) return;
    const fileName = achievements[index].img.replace("https://api.beta.dofusdb.fr/img/achievements/", "");
    const file = "public/img/achievements/" + fileName;

    console.log(achievements[index].img);

    downloadImageToUrl(achievements[index].img, file, () => {getAchievementsIcon(achievements, index + 1)});
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
                downloaded.push(url);
                callback();                          
            });                                                                         
        }).end();
    }
};