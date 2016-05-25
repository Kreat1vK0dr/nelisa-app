const fs = require('fs');
const exec = require('child_process').exec;
exec('Rscript --no-restore --no-save test.R James', function(error,stdout,stderr){
  if (error){
  console.error(`exec error: ${error}`);
  return;
}
var matrixTxt = fs.readFileSync('./output/test.txt','utf8');
var matrixCsv = fs.readFileSync('./output/test.csv','utf8');
var name = fs.readFileSync('./output/name.txt','utf8');

console.log("This is matrix:\n", matrixTxt.split('\n'));
console.log("This is matrix:\n", matrixCsv);
console.log("This is name:\n", name);
});
// const spawn = require('child_process').spawn;
// const ls = spawn('ls', ['-lh', '/usr']);
