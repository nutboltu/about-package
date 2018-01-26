# about-package
[![dependencies Status](https://david-dm.org/nutboltu/about-package/status.svg)](https://david-dm.org/nutboltu/about-package) [![Build Status](https://travis-ci.org/nutboltu/about-package.svg?branch=master)](https://travis-ci.org/nutboltu/about-package)

A lightweight package that retrieve the information of a npm package

## Installation
```bash
npm install --save about-package
```

## Usage
```javascript
var aboutPackage = require('about-package');

aboutPackage('express', function(err, info) {
  if (err) {
    console.error(err);
  }
  else console.log(info);
});
```
This will output
```javascript
{ 
  name: 'express',
  version: '4.16.2',
  repository:
   { 
     type: 'git',
     url: 'git+https://github.com/expressjs/express.git' 
    },
  description: 'Fast, unopinionated, minimalist web framework',
  license: 'MIT',
  downloads: {
    lastDay: 726729,
    lastWeek: 4254539,
    lastMonth: 4254539
  },
  github: {
    stars: 36286,
    forks: 6541,
    openIssues: 166,
    watchers: 36286,
    lastUpdated: '2018-01-26T13:00:10Z',
    created: '2009-06-26T18:56:01Z' 
  }
}
```

## License

MIT Licensed. Copyright (c) Farhad Yasir 2018.