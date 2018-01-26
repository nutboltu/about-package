var aboutPackage = require('./index');

aboutPackage('express', function(err, info) {
  if (err) {
    console.error(err);
  }
  else console.log(info);
});
