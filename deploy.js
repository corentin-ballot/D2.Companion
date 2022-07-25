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
        console.log(err);
        console.log('Deploy Complete!');
    }
)