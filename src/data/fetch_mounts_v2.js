/**
 * Fetch mounts data from https://www.dofusbook.net
 * run `npm run fetch` to refresh data
 */

const fs = require('fs')
const https = require('https');
const Stream = require('stream').Transform;

module.exports = fetchMounts = (mounts = [], page = 1) => {
    const url = `https://www.dofusbook.net/items/dofus/search/equipment?context=item&include=26-25-23&page=${page}&sort=desc`;
    console.log(url);
    https.get(url, (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received.
        resp.on('end', () => {
            const _d = JSON.parse(data);

            const mnts = [...mounts, ..._d.data.map(m => ({
                _id: m.official,
                ankamaId: m.official,
                name: m.name,
                effects: m.effects.map(e => ({
                    id: e.id,
                    min: e.min,
                    max: e.max,
                }))
            }))];

            console.log("page", page, "_d.pages", _d.pages, "page >= _d.pages", page >= _d.pages);

            if (page >= _d.pages) {
                fs.writeFile(__dirname + "/mounts.json", JSON.stringify(mnts), err => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                });
            } else {
                getMountIcon(_d.data);
                fetchMounts(mnts, page + 1);
            }

        });

    }).on("error", (err) => {
        console.error(err.message);
    });
}

function getMountIcon(mounts, index = 0) {
    if (!mounts[index]) return;
    const url = `https://www.dofusbook.net/static/items/${mounts[index].picture}_0.png`;
    const file = "public/img/mounts/" + mounts[index].official + ".png";

    console.log(url);

    downloadImageToUrl(url, file, () => { getMountIcon(mounts, index + 1) });
}

var downloadImageToUrl = (url, filename, callback) => {
    https.request(url, function (response) {
        var data = new Stream();

        response.on('data', function (chunk) {
            data.push(chunk);
        });

        response.on('end', function () {
            fs.writeFileSync(filename, data.read());
            callback();
        });
    }).end();
};