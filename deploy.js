var ghpages = require('gh-pages');

ghpages.publish(
    './build/',
    {
        message: 'Deploy',
        repo: 'https://github.com/corentin-ballot/D2.Companion.git',
        remote: 'origin',
        branch: 'deploy'
    },
    (err) => {
        if(err) console.log(err);
        else console.log(`[${(new Date()).toLocaleString()}]`, 'Deploy Complete!');
    }
)