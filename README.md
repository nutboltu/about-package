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
## Output
| Attribute              | Type       | Description |
|-------------------|------------|-------------|
| `name`         | string  | Package name |
| `version`  | string  | Latest version of that npm package |
| `description`  | string  | Description of that npm package
| `license`  | string  | Type of license of that npm package
| `downloads`  | object  | This attribute contains number of download counts on `last day`, `last week` and `last month`
| `github`  | object  | This attribute contains github information of that npm package. e.g: `stars`, `forks`, `open issues`, `watchers`, `last updated` and `created`
## Sample Output
```javascript
{ 
  name: 'express',
  version: '4.16.2',
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