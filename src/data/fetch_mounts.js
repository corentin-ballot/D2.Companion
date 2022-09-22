/**
 * Fetch mounts data from https://dofapi.fr
 * run `npm run fetch` to refresh data
 */

 const fs = require('fs')
 const https = require('https');
 const api = "https://fr.dofus.dofapi.fr/";
 const routes = ["mounts"];
 const Stream = require('stream').Transform;
 
 module.exports = fetchMounts = () => {
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
 
                 getMountIcon(JSON.parse(data));
             });
 
         }).on("error", (err) => {
             console.error(err.message);
         });
 
     });
 }
 
 function getMountIcon(mounts, index = 0) {
     if(!mounts[index]) return;
     const url = mounts[index].imgUrl.replace("https://s.ankama.com/www/", "https://")
     const file = "public/img/mounts/" + mounts[index].ankamaId + ".png";
 
     console.log(mounts[index].imgUrl);
 
     downloadImageToUrl(url, file, () => {getMountIcon(mounts, index + 1)});
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