const fs = require('fs')
const https = require('https');
const Stream = require('stream').Transform;


/**
 * Fetch classes data from https://dofapi.fr and get classes images from https://s.ankama.com
 * run `npm run fetch` to refresh data
 */
module.exports = fetchClasses = () => {
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
                    const url = classe[sex + "Img"].replace("https://s.ankama.com/www/static.ankama.com/dofus/renderer/look/", "https://static.ankama.com/dofus/renderer/look/");

                    downloadImageToUrl(url, file);
                })

            });
        });

    }).on("error", (err) => {
        console.error(err.message);
    });
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