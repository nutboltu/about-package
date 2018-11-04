var aboutPackage = require('./index');

aboutPackage('react', function(err, info) {
  if (err) {
    console.error(err);
  }
  else console.log(info);
});
