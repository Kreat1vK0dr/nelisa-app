var fs = require('fs');

var content = fs.readFileSync("./data/purchases/purchases.csv", 'utf-8'),
    data = [],
    track = new Map();
content = content.split('\n');
content.forEach(function(line){
  line = line.split(';');
  if (track.get(line[0])===undefined && line[0]!=='supplier'){
  track.set(line[0],1);
  data.push(line[0]);
}
});
data = data.join('\n');
fs.writeFileSync('./data/suppliers/suppliers.csv',data);
