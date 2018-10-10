var ghpages = require('gh-pages');

ghpages.publish('build', err => console.error(err));
